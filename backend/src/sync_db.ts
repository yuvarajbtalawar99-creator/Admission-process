import sequelize from './config/database';
import AdmissionAcademicDetail from './models/AdmissionAcademicDetail';
import Admission from './models/Admission';
import RejectionReason from './models/RejectionReason';

async function main() {
  try {
    console.log("Synchronizing database alterations...");
    await RejectionReason.sync({ alter: true });
    await Admission.sync({ alter: true });
    await AdmissionAcademicDetail.sync({ alter: true });
    console.log("Database column synced successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Failed to sync database column:", err);
    process.exit(1);
  }
}

main();
