exports.logAdminActivity = (pool, {
  adminId,
  action,
  targetType,
  targetId,
  description,
}) => {
  const sql = `
    INSERT INTO admin_activity_logs
    (admin_id, action, target_type, target_id, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  pool.query(sql, [
    adminId,
    action,
    targetType,
    targetId,
    description,
  ]);
};
