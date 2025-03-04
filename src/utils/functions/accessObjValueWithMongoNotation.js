export default function accessObjValueWithMongoNotation(obj, field) {
  let fieldList = field.split(".");
  let subObj = obj;
  // console.log({ subObj });
  for (let field of fieldList) {
    if (subObj?.hasOwnProperty(field)) {
      subObj = subObj[field];
      // console.log({ subObj });
    } else {
      return null;
    }
  }
  return subObj;
}
