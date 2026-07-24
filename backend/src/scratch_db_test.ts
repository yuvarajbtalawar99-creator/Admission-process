import sequelize from './config/database';
import Admission from './models/Admission';
import User from './models/User';
import Department from './models/Department';

async function run() {
  try {
    const apps = await Admission.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: Department, as: 'branch' }
      ]
    });
    console.log("DUMPING ALL APPLICATIONS:");
    apps.forEach(app => {
      console.log(`ID: ${app.id}, Num: ${app.applicationNumber}, Name: ${app.user?.firstName} ${app.user?.lastName}, Branch: ${app.branch?.code || 'NULL'}, Status: ${app.applicationStatus}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
