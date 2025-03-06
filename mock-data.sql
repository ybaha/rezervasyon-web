-- Insert mock users (both business owners and customers)
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  -- Business Owners
  ('11111111-1111-1111-1111-111111111111', 'john.owner@example.com', '{"full_name": "John Owner"}'),
  ('22222222-2222-2222-2222-222222222222', 'sarah.boss@example.com', '{"full_name": "Sarah Boss"}'),
  ('33333333-3333-3333-3333-333333333333', 'mike.employer@example.com', '{"full_name": "Mike Employer"}'),
  
  -- Customers
  ('44444444-4444-4444-4444-444444444444', 'customer1@example.com', '{"full_name": "Alice Customer"}'),
  ('55555555-5555-5555-5555-555555555555', 'customer2@example.com', '{"full_name": "Bob User"}'),
  ('66666666-6666-6666-6666-666666666666', 'customer3@example.com', '{"full_name": "Charlie Client"}'),
  ('77777777-7777-7777-7777-777777777777', 'customer4@example.com', '{"full_name": "Diana Patron"}'),
  ('88888888-8888-8888-8888-888888888888', 'customer5@example.com', '{"full_name": "Edward Guest"}'),
  ('99999999-9999-9999-9999-999999999999', 'customer6@example.com', '{"full_name": "Fiona Visitor"}'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'customer7@example.com', '{"full_name": "George Client"}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'customer8@example.com', '{"full_name": "Hannah User"}'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'customer9@example.com', '{"full_name": "Ian Customer"}'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'customer10@example.com', '{"full_name": "Julia Patron"}');

-- Update user profiles for business owners
UPDATE user_profiles 
SET is_business_owner = true,
    phone = '+1234567890'
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

-- Insert businesses
INSERT INTO businesses (
  id, owner_id, industry_id, name, slug, description, address, city, 
  state, country, postal_code, phone, email, website, is_verified, is_active, 
  rating, review_count, price_level
)
VALUES
  -- Car Wash Businesses
  (
    'b1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM industries WHERE slug = 'carwash'),
    'Sparkle & Shine Auto Wash',
    'sparkle-shine-auto-wash',
    'Premium car washing services with state-of-the-art equipment',
    '123 Main St',
    'Los Angeles',
    'CA',
    'USA',
    '90012',
    '+1234567890',
    'info@sparkleshine.com',
    'https://sparkleshine.com',
    true,
    true,
    4.5,
    25,
    2
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM industries WHERE slug = 'carwash'),
    'Elite Auto Care',
    'elite-auto-care',
    'Luxury car detailing and premium washing services',
    '456 Luxury Lane',
    'Beverly Hills',
    'CA',
    'USA',
    '90210',
    '+1234567891',
    'info@eliteautocare.com',
    'https://eliteautocare.com',
    true,
    true,
    4.8,
    50,
    4
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM industries WHERE slug = 'carwash'),
    'Quick & Clean Car Wash',
    'quick-clean-car-wash',
    'Fast and efficient car washing services',
    '789 Beach Rd',
    'Santa Monica',
    'CA',
    'USA',
    '90401',
    '+1234567892',
    'info@quickclean.com',
    'https://quickclean.com',
    true,
    true,
    4.2,
    30,
    1
  );

-- Insert services for each business
INSERT INTO services (
  id, business_id, name, description, price, duration, is_active
)
VALUES
  -- Services for Sparkle & Shine
  (
    'aaaaaaaa-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111',
    'Basic Wash',
    'Exterior wash with hand dry',
    19.99,
    30,
    true
  ),
  (
    'aaaaaaaa-2222-2222-2222-222222222222',
    'b1111111-1111-1111-1111-111111111111',
    'Premium Wash',
    'Exterior wash, wax, and interior cleaning',
    39.99,
    60,
    true
  ),
  -- Services for Elite Auto Care
  (
    'bbbbbbbb-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    'Luxury Detail',
    'Complete interior and exterior detailing',
    199.99,
    180,
    true
  ),
  (
    'bbbbbbbb-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'Express Detail',
    'Quick but thorough detailing service',
    99.99,
    90,
    true
  ),
  -- Services for Quick & Clean
  (
    'cccccccc-1111-1111-1111-111111111111',
    'b3333333-3333-3333-3333-333333333333',
    'Express Wash',
    'Quick exterior wash',
    14.99,
    20,
    true
  ),
  (
    'cccccccc-2222-2222-2222-222222222222',
    'b3333333-3333-3333-3333-333333333333',
    'Full Service',
    'Complete wash and basic interior cleaning',
    29.99,
    45,
    true
  );

-- Insert available slots
INSERT INTO available_slots (
  id, business_id, service_id, date, time, is_booked, available_staff_count
)
SELECT
  uuid_generate_v4(),
  business_id,
  service_id,
  current_date + (n || ' days')::interval,
  time_slot,
  false,
  2
FROM
  (SELECT * FROM services) s
  CROSS JOIN generate_series(0, 14) n
  CROSS JOIN (
    SELECT '09:00:00'::time + (interval '1 hour' * generate_series(0, 8)) as time_slot
  ) t
WHERE
  EXTRACT(DOW FROM current_date + (n || ' days')::interval) NOT IN (0, 6); -- Exclude weekends

-- Insert reservations
INSERT INTO reservations (
  id, booking_reference, user_id, business_id, service_id, slot_id,
  reservation_date, reservation_time, status, notes, total_amount
)
SELECT
  uuid_generate_v4(),
  'BK-' || LPAD(FLOOR(random() * 1000000)::TEXT, 6, '0'),
  user_id,
  business_id,
  service_id,
  slot_id,
  date,
  time,
  status,
  'Customer notes: ' || notes,
  price
FROM (
  VALUES
    ('44444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', 'confirmed', 'Regular customer', 19.99),
    ('55555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-1111-1111-1111-111111111111', 'completed', 'VIP treatment requested', 199.99),
    ('66666666-6666-6666-6666-666666666666', 'b3333333-3333-3333-3333-333333333333', 'cccccccc-1111-1111-1111-111111111111', 'confirmed', 'First time customer', 14.99),
    ('77777777-7777-7777-7777-777777777777', 'b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-2222-2222-2222-222222222222', 'completed', 'Regular maintenance', 39.99),
    ('88888888-8888-8888-8888-888888888888', 'b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-2222-2222-2222-222222222222', 'confirmed', 'Special requests noted', 99.99),
    ('99999999-9999-9999-9999-999999999999', 'b3333333-3333-3333-3333-333333333333', 'cccccccc-2222-2222-2222-222222222222', 'pending', 'Needs extra attention', 29.99),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', 'completed', 'Regular wash', 19.99),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'b2222222-2222-2222-2222-222222222222', 'bbbbbbbb-1111-1111-1111-111111111111', 'cancelled', 'Customer rescheduling', 199.99),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'b3333333-3333-3333-3333-333333333333', 'cccccccc-1111-1111-1111-111111111111', 'completed', 'Quick service', 14.99),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'b1111111-1111-1111-1111-111111111111', 'aaaaaaaa-2222-2222-2222-222222222222', 'confirmed', 'Premium service', 39.99)
  ) AS v(user_id, business_id, service_id, status, notes, price)
CROSS JOIN (
  SELECT id as slot_id, date, time
  FROM available_slots
  WHERE is_booked = false
  LIMIT 10
) AS slots;

-- Update the used slots to booked
UPDATE available_slots
SET is_booked = true
WHERE id IN (
  SELECT slot_id FROM reservations
);

-- Insert reviews for completed reservations
INSERT INTO reviews (
  id, business_id, user_id, reservation_id, rating, comment, is_published
)
SELECT
  uuid_generate_v4(),
  r.business_id,
  r.user_id,
  r.id as reservation_id,
  FLOOR(random() * 2 + 4)::integer as rating, -- Ratings between 4 and 5
  CASE FLOOR(random() * 3)::integer
    WHEN 0 THEN 'Great service! Very professional and thorough.'
    WHEN 1 THEN 'Excellent experience. Will definitely come back.'
    WHEN 2 THEN 'Top notch service and friendly staff.'
  END as comment,
  true as is_published
FROM reservations r
WHERE r.status = 'completed';

-- Insert business hours for each business
INSERT INTO business_hours (
  business_id, day_of_week, open_time, close_time, is_closed
)
SELECT
  b.id as business_id,
  d.day as day_of_week,
  CASE 
    WHEN d.day = 0 THEN NULL -- Sunday
    WHEN d.day = 6 THEN '10:00'::time -- Saturday
    ELSE '09:00'::time -- Weekdays
  END as open_time,
  CASE 
    WHEN d.day = 0 THEN NULL -- Sunday
    WHEN d.day = 6 THEN '16:00'::time -- Saturday
    ELSE '18:00'::time -- Weekdays
  END as close_time,
  CASE 
    WHEN d.day = 0 THEN true -- Sunday
    ELSE false
  END as is_closed
FROM businesses b
CROSS JOIN generate_series(0, 6) as d(day); 