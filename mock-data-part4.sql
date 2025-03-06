-- First create available slots for March 2025
INSERT INTO available_slots (
  id, business_id, service_id, date, time, is_booked, available_staff_count
)
SELECT
  uuid_generate_v4(),
  'e2a27adc-7820-4947-b88c-f6f351d3ea6e'::uuid,
  s.id,
  '2025-03-07'::date + (n || ' days')::interval,
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
  s.business_id = 'e2a27adc-7820-4947-b88c-f6f351d3ea6e'::uuid
  AND EXTRACT(DOW FROM '2025-03-07'::date + (n || ' days')::interval) NOT IN (0, 6); -- Exclude weekends

-- Insert reservations with fixed dates
INSERT INTO reservations (
  id, booking_reference, user_id, business_id, service_id, slot_id,
  reservation_date, reservation_time, status, notes, total_amount
)
WITH numbered_slots AS (
  SELECT 
    id as slot_id,
    date,
    time,
    ROW_NUMBER() OVER (ORDER BY date, time) as rn
  FROM available_slots 
  WHERE 
    business_id = 'e2a27adc-7820-4947-b88c-f6f351d3ea6e'::uuid
    AND is_booked = false
  ORDER BY date, time
  LIMIT 10
)
SELECT
  uuid_generate_v4(),
  'BK-' || LPAD(FLOOR(random() * 1000000)::TEXT, 6, '0'),
  user_id::uuid,
  'e2a27adc-7820-4947-b88c-f6f351d3ea6e'::uuid,
  service_id::uuid,
  slot_id,
  date,
  time,
  status,
  'Customer notes: ' || notes,
  price
FROM (
  VALUES
    ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'Regular customer', 19.99),
    ('55555555-5555-5555-5555-555555555555', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'VIP treatment requested', 19.99),
    ('66666666-6666-6666-6666-666666666666', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'First time customer', 39.99),
    ('77777777-7777-7777-7777-777777777777', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'Regular maintenance', 39.99),
    ('88888888-8888-8888-8888-888888888888', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'Special requests noted', 19.99),
    ('99999999-9999-9999-9999-999999999999', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'Needs extra attention', 39.99),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'Regular wash', 19.99),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'Premium service', 39.99),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'Quick service', 19.99),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'Full service', 39.99)
  ) AS v(user_id, service_id, status, notes, price)
CROSS JOIN numbered_slots;

-- Update the used slots to booked
UPDATE available_slots
SET is_booked = true
WHERE id IN (
  SELECT slot_id FROM reservations
  WHERE business_id = 'e2a27adc-7820-4947-b88c-f6f351d3ea6e'::uuid
); 