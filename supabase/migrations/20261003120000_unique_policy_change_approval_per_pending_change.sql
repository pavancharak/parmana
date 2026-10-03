-- =============================================================================
-- One approval record per pending policy change
--
-- PolicyChangeApprovalService writes the signed approval record before
-- it writes the live policy file. Two approvals of the same pending
-- change at the same moment could both pass the route's
-- PENDING_APPROVAL check, then both sign a record and both write the
-- policy. With this index the second insert fails with a unique
-- violation, which the repository maps to a 409, so the second
-- approval stops before it touches the live policy.
--
-- Before 2026-10-03 the approve route did not check the change's
-- status before writing the record, so approving an already resolved
-- change could add a second record for it. If creating this index
-- fails with a unique violation, list those rows with
--
--   SELECT pending_policy_change_id, count(*)
--   FROM policy_change_approval_records
--   GROUP BY pending_policy_change_id
--   HAVING count(*) > 1;
--
-- and resolve them by hand. Signed records are evidence: do not delete
-- one without keeping a copy.
-- =============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS uniq_policy_change_approval_records_pending_change
ON policy_change_approval_records (
    pending_policy_change_id
);
