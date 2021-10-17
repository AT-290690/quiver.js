import { Quiver } from '../../../quiver/quiver.js';
const quiv = new Quiver();
quiv.setNodes({"AGE":{"key":"AGE","next":["FIND_AGE"],"prev":null,"level":0,"type":"root"},"FIND_AGE":{"key":"FIND_AGE","next":["GET_ACTUAL_AGE"],"prev":"AGE","level":1,"type":"branch"},"GET_ACTUAL_AGE":{"key":"GET_ACTUAL_AGE","next":["PRINT"],"prev":"FIND_AGE","level":2,"type":"branch"},"PRINT":{"key":"PRINT","next":[],"prev":"GET_ACTUAL_AGE","level":3,"type":"leaf"}});

quiv.func["AGE"] = async (value, key, prev, next) => {
return { birthDate: new Date(value), today: new Date() }

}
quiv.func["FIND_AGE"] = async (value, key, prev, next) => {
const { today, birthDate } = value
const age = today.getYear() - birthDate.getYear()
const month = today.getMonth() - birthDate.getMonth()
return { age, month }

}
quiv.func["GET_ACTUAL_AGE"] = async (value, key, prev, next) => {
const { age, month } = value
return month < 0 ||
(month === 0
&& today.getDate() < birthDate.getDate()) ?
age - 1 : age

}
quiv.func["PRINT"] = async (value, key, prev, next) => {
quiv.log(value)
};
export default (value) => {
quiv.setRoot(quiv.nodes["AGE"].key);
quiv.reset();
quiv.goTo(quiv.root, value);
}