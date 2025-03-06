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