-- Insert available slots
INSERT INTO available_slots (
  id, business_id, service_id, date, time, is_booked, available_staff_count
)
SELECT
  uuid_generate_v4(),
  s.business_id,
  s.id as service_id,
  current_date + (n || ' days')::interval,
  time_slot,
  false,
  2
FROM
  services s
  CROSS JOIN generate_series(0, 14) n
  CROSS JOIN (
    SELECT '09:00:00'::time + (interval '1 hour' * generate_series(0, 8)) as time_slot
  ) t
WHERE
  EXTRACT(DOW FROM current_date + (n || ' days')::interval) NOT IN (0, 6); -- Exclude weekends 