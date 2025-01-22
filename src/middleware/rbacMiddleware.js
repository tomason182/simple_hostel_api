import roles from "../setup/roles.json" with { type: "json" };

function getPermissionByRoleName(roleName) {
  const result = roles.roles.find(role => role.name === roleName);

  return result.permissions || []
}


export default function checkPermission (permission) {
    return async(req, res, next) => {
      const userRole = await userOutputPort.findUserRole(req.user);
      const userPermission = getPermissionByRoleName(userRole);

      if(userPermission.includes(permission)) {
        return next();
      } else {
        res.status(403);
        throw new Error("Access denied")
      }
    }  
}
  
