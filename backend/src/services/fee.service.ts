import Fee from '../models/Fee';
import FeePayment from '../models/FeePayment';
import Student from '../models/Student';
import sequelize from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/error.util';
import logger from '../utils/logger.util';

class FeeService {
  /**
   * Retrieves all fee records for a student, including transaction logs.
   */
  async getStudentFees(userId: string) {
    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      throw new NotFoundError('Student profile not found.');
    }

    const feeRecords = await Fee.findAll({
      where: { studentId: student.id },
      include: [
        {
          model: FeePayment,
          as: 'payments',
          attributes: ['id', 'amountPaid', 'paymentDate', 'paymentMethod', 'transactionReference', 'status'],
        },
      ],
      order: [['dueDate', 'ASC']],
    });

    return feeRecords;
  }

  /**
   * Processes a fee payment under a secure database transaction block.
   */
  async payFee(
    userId: string,
    feeId: string,
    amount: number,
    paymentMethod: 'CARD' | 'UPI' | 'NET_BANKING' | 'CASH',
    transactionReference: string
  ) {
    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      throw new NotFoundError('Student profile not found.');
    }

    // Start a transaction for safe multi-step updates
    const t = await sequelize.transaction();

    try {
      // Find fee and lock row for update
      const fee = await Fee.findOne({
        where: { id: feeId, studentId: student.id },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!fee) {
        throw new NotFoundError('Fee record not found or does not belong to the student.');
      }

      if (fee.status === 'PAID') {
        throw new BadRequestError('This fee has already been fully paid.');
      }

      const totalAmount = Number(fee.totalAmount);
      const currentPaid = Number(fee.paidAmount);
      const remaining = totalAmount - currentPaid;

      if (amount <= 0 || amount > remaining) {
        throw new BadRequestError(`Invalid payment amount. Remaining balance is ₹${remaining.toLocaleString()}.`);
      }

      // 1. Create the payment record
      const payment = await FeePayment.create(
        {
          feeId: fee.id,
          amountPaid: amount,
          paymentMethod,
          transactionReference,
          status: 'SUCCESS',
        },
        { transaction: t }
      );

      // 2. Update Fee totals and status
      const nextPaidAmount = currentPaid + amount;
      fee.paidAmount = nextPaidAmount;
      fee.status = nextPaidAmount >= totalAmount ? 'PAID' : 'PENDING';
      await fee.save({ transaction: t });

      // Commit transaction
      await t.commit();
      logger.info(`Successfully processed payment of ₹${amount} for fee ${feeId} (Ref: ${transactionReference})`);

      return {
        fee,
        payment,
      };
    } catch (error) {
      // Rollback transaction on failure
      await t.rollback();
      logger.error(`Failed to process fee payment: ${(error as any).message}`);
      throw error;
    }
  }
}

export default new FeeService();
