
// Novel way to drive behavior of Smart Contract.

// 
const CDTYPE = "ContractDefinition";
const CNAME = "CarRental";
const contractDefn = ca =>
  ca.ast.nodes.find(n => n.nodeType === CDTYPE && n.name === CNAME);

const cars = (ca) => {
  const item = contractDefn(ca).nodes.find((n) => n.name === "Car");
  if (!item) return null;

  return item
    .members
    .map((t) => ({
      name: t.name,
      nodeType: t.nodeType,
      stateVariable: t.stateVariable,
      type: t.typeName.name,
      mutability: t.typeName.stateMutability,
    }));
};

const rentals = (ca) => {
  const item = contractDefn(ca).nodes.find((n) => n.name === "Rental");
  if (!item) return null;

  return item
    .members
    .map((t) => ({
      name: t.name,
      nodeType: t.nodeType,
      stateVariable: t.stateVariable,
      type: t.typeName.name,
      mutability: t.typeName.stateMutability,
    }));
};

const isDefined = members => variableName => {
  return members 
    ? members.find((item) => item.name === variableName) 
    : null;
};

const isPayable = members => variableName => {
  if (members === undefined) return false;
  const definition = members.find((item) => item.name === variableName);
  return definition && definition.mutability === "payable";
};

const isType = members => variableName => type => {
  if (members === undefined) return false;
  const definition = members.find((item) => item.name === variableName);
  return definition && definition.type === type;
};

module.exports = {
  rentals,
  cars,
  isDefined,
  isPayable,
  isType,
};

