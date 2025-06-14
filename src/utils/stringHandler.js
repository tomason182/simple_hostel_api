export const legend = (smallImageNames) => {
  const smallImageString = smallImageNames.substring(0, smallImageNames.length-2);
  let msg = `The following images: ${smallImageString} do not meet the requirement of being 1000 pixels or more in height.`;
  if (msg.lastIndexOf(",") === -1) {
    return msg;
  }
  msg = msg.slice(0, msg.lastIndexOf(",")) + " and" + msg.slice(msg.lastIndexOf(",")+1);
  return msg;
}
