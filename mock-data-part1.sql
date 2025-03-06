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