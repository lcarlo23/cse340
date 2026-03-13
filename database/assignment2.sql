-- QUERY 1
-- Insert new record to the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- QUERY 2
-- Modify the Tony Stark record
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- QUERY 3
-- Delete the Tony Stark record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- QUERY 4
-- Modify the "GM Hummer" record
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- QUERY 5
-- Use an inner join to select the make and model fields
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory i
    JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- QUERY 6
-- Update all records in the inventory
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/');