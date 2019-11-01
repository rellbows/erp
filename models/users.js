const Sequelize = require('sequelize');
//add correct credentials here
const sequelize = new Sequelize('database', 'user', 'password', {
	host: '',
	port: '',
	dialect: 'mysql',
	dialectOptions: {
        socketPath: "/var/run/mysqld/mysqld.sock"
    },
	define: {
	timestamps: false
	},
	//logging: console.log
});
const Department = sequelize.define('department', {
	dept_id: {
		type: Sequelize.INTEGER(11),
		primaryKey: true,
		autoIncrement: true
	},
	dept_name: Sequelize.STRING(50),
	address: Sequelize.STRING,
	city: Sequelize.STRING,
	state: Sequelize.STRING
	},
	{freezeTableName: true} 
	);

const User = sequelize.define('user', {
  user_id:{
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  user_type: Sequelize.STRING(50),
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  signature_image_path: Sequelize.STRING,
  account_created: Sequelize.DATE,
  /*department_id: {
	type: Sequelize.INTEGER(11),
	required: true,
    allowNull: false 
	}*/
}, {
    freezeTableName: true
});

Department.hasMany(User, {foreignKey: 'department_id'});
User.belongsTo(Department, {foreignKey: 'department_id', foreignKeyConstraint: true});
sequelize.sync().then(()=>{
})
/*sequelize.query("SELECT * FROM `user` WHERE `user_id` = 1").then(function (result) {
		console.log(result);
    });*/

module.exports = User;
