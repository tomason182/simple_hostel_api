import sanitize from "sanitize-filename";

export const rename = (originalname) => {
  let sanitized = sanitize(originalname);
  sanitized = sanitized.substring(0, sanitized.lastIndexOf("."));
  const uniqueName = `image-${
    Date.now() + "-" + Math.round(Math.random() * 1e9)
  }-${sanitized}.webp`;
  return uniqueName;
};

export const legend = (smallImageNames) => {
  smallImageNames = smallImageNames.substring(0, smallImageNames.length-2);
  let msg = `The following images: ${smallImageNames} do not meet the requirement of being 1000 pixels or more in height.`;
  if (msg.lastIndexOf(",") === -1) {
    return msg;
  }
  msg = msg.slice(0, msg.lastIndexOf(",")) + " and" + msg.slice(msg.lastIndexOf(",")+1);
  return msg;
}
