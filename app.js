const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser');
const db = require('./util/database');
var cors = require('cors')
const app = express();
const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group'); 
const UserGroup = require('./models/userGroup'); 

app.use(cors());

const routes = require('./routes/general');
app.use(bodyParser.json());    
//app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

Message.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Message)

User.belongsToMany(Group, { through:UserGroup})
Group.belongsToMany(User, { through:UserGroup})

Group.hasMany(Message);
Message.belongsTo(Group);

//Message.belongsTo(UserGroup, { constraints: true, onDelete: 'CASCADE' });
//UserGroup.hasMany(Message)

db.sync() //{force: true}
.then(() => {app.listen(3000)})
.catch(err => {console.log(err)})

