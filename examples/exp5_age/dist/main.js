import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"AGE":{"key":"AGE","next":["FIND_AGE"],"prev":null,"level":0,"group":0,"type":"root"},"FIND_AGE":{"key":"FIND_AGE","next":["GET_ACTUAL_AGE"],"prev":"AGE","level":1,"group":0,"type":"branch"},"GET_ACTUAL_AGE":{"key":"GET_ACTUAL_AGE","next":["PRINT"],"prev":"FIND_AGE","level":2,"group":0,"type":"branch"},"PRINT":{"key":"PRINT","next":[],"prev":"GET_ACTUAL_AGE","level":3,"group":0,"type":"leaf"}});

quiv.fn["AGE"] = (value, key, prev, next) => {
return { birthDate: new Date(value), today: new Date() }

}
quiv.fn["FIND_AGE"] = (value, key, prev, next) => {
const {today,birthDate} = value;

const age = today.getYear() - birthDate.getYear()
const month = today.getMonth() - birthDate.getMonth()
return { age, month }

}
quiv.fn["GET_ACTUAL_AGE"] = (value, key, prev, next) => {
const {age,month} = value;

return month < 0 ||
(month === 0
&& today.getDate() < birthDate.getDate()) ?
age - 1 : age

}
quiv.fn["PRINT"] = (value, key, prev, next) => {
return quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["AGE"].key);
quiv.visited = {};
quiv.goTo(quiv.root, value);
}