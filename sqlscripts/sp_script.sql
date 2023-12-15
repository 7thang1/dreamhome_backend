DELIMITER //
CREATE PROCEDURE sp_check_user_exist(IN email_to_check VARCHAR(255), OUT user_exists BOOLEAN)
BEGIN
    SELECT COUNT(*) INTO user_exists
    FROM user
    WHERE user_email = email_to_check;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_create_user(
    IN email_param VARCHAR(255),
    IN fullname_param VARCHAR(255),
    IN password_param VARCHAR(255)
)
BEGIN
	INSERT INTO user (user_email, user_name, user_password)
	VALUES (email_param, fullname_param, password_param);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_login_user(
    IN p_user_email VARCHAR(255)
)
BEGIN
    SELECT
        user_id,
        user_password as password,
        user_role
    FROM user
    WHERE user_email = p_user_email AND user_status = TRUE;

END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE sp_get_user_by_email(
    IN p_user_email VARCHAR(255)
)
BEGIN
    SELECT *
    FROM user
    WHERE user_email = p_user_email;
END //
DELIMITER ;

DELIMITER //
DELIMITER //
CREATE PROCEDURE sp_get_user_by_id(
    IN p_id INT
)
BEGIN
    SELECT *
    FROM user
    WHERE user_id = p_id;
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_get_list_property(
    IN p_page_number INT,
    IN p_records_per_page INT
)
BEGIN
    DECLARE offset_value INT DEFAULT 0;

    SET offset_value = (p_page_number - 1) * p_records_per_page;

    SELECT
        pr.property_id,
        pr.user_id,
        pr.property_name,
        pr.price,
        pr.discounted_price,
        pr.bedroom,
        pr.bathroom,
        pr.area,
        pr.on_sale,
        d.name AS district_name,
        p.name AS province_name,
        pi.image_url as image_url
    FROM
        property pr
    LEFT JOIN
        districts d ON pr.district_code = d.code
    LEFT JOIN
        provinces p ON pr.province_code = p.code
    LEFT JOIN
        property_images pi ON pr.property_id = pi.property_id
    ORDER BY
        pr.created_at DESC
    LIMIT
        p_records_per_page
    OFFSET
        offset_value;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_update_user(
    IN p_user_id INT,
    IN p_user_email VARCHAR(255),
    IN p_user_name VARCHAR(255),
    IN p_user_phone VARCHAR(255),
    IN p_user_role ENUM('user','reseller','investor'),
    IN p_user_image VARCHAR(255)
)
BEGIN
    UPDATE user
    SET
        user_email = p_user_email,
        user_name = p_user_name,
        user_phone = p_user_phone,
        user_role = p_user_role,
        user_image = p_user_image
    WHERE
        user_id = p_user_id;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE sp_reset_password(
    IN p_user_id INT,
    IN p_user_password VARCHAR(255)
)
BEGIN
    UPDATE user
    SET
        user_password = p_user_password
    WHERE user_id = p_user_id;
END //

DELIMITER ;

delimiter //
create procedure sp_get_list_property_by_user (
    IN p_user_id INT
)
begin
    select
        pr.property_id,
        pr.property_name,
        pr.price,
        pr.discounted_price,
        pr.bedroom,
        pr.bathroom,
        pr.area,
        pr.on_sale,
        d.name as district_name,
        p.name as province_name,
    (
        SELECT pi.image_url
        FROM property_images pi
        WHERE pi.property_id = pr.property_id
        LIMIT 1
    ) AS image_url
    from property pr
    left join districts d on pr.district_code = d.code
    left join provinces p on pr.province_code = p.code
    where pr.user_id = p_user_id
    order by pr.created_at desc;
end //
delimiter ;

call sp_get_list_property_by_user(4);

DELIMITER //
CREATE PROCEDURE sp_insert_property(
    IN p_user_id INT,
    IN p_property_name VARCHAR(255),
    IN p_short_desc TEXT,
    IN p_detail_desc TEXT,
    IN p_price DECIMAL(15,2),
    IN p_province_code VARCHAR(20),
    IN p_district_code VARCHAR(20),
    IN p_ward_code VARCHAR(20),
    IN p_address TEXT,
    IN p_bedroom INT,
    IN p_bathroom INT,
    IN p_construction_year INT,
    IN p_parking_slot INT,
    IN p_property_category ENUM('sell', 'rent', 'project'),
    IN p_category ENUM('Căn hộ chung cư', 'Nhà riêng', 'Nhà mặt phố', 'Nhà biệt thự, liền kề', 'Đất', 'Đất nền dự án', 'Trang trại', 'khu nghỉ dưỡng', 'Nhà kho, nhà xưởng', 'Bất động sản khác'),
    IN p_area DECIMAL(10, 2)
)
BEGIN
    INSERT INTO property (
                          user_id,
                          property_name,
                          short_desc,
                          detail_desc,
                          price,
                          province_code,
                          district_code,
                          ward_code,
                          address,
                          bedroom,
                          bathroom,
                          construction_year,
                          parking_slot,
                          property_category,
                          category,
                          area )
    VALUES (
            p_user_id,
            p_property_name,
            p_short_desc,
            p_detail_desc,
            p_price,
            p_province_code,
            p_district_code,
            p_ward_code,
            p_address,
            p_bedroom,
            p_bathroom,
            p_construction_year,
            p_parking_slot,
            p_property_category,
            p_category,
            p_area
           );
    SELECT LAST_INSERT_ID() AS property_id;
END //
DELIMITER ;

DELIMITER //

CREATE TRIGGER set_expiry_date
BEFORE INSERT ON property
FOR EACH ROW
BEGIN
    SET NEW.expired_at = DATE_ADD(NEW.created_at, INTERVAL 30 DAY);
END //

DELIMITER ;


DELIMITER //
create procedure sp_update_property (
    IN p_property_id INT,
    IN p_user_id INT,
    IN p_property_name VARCHAR(255),
    IN p_short_desc TEXT,
    IN p_detail_desc TEXT,
    IN p_price DECIMAL(15,2),
    IN p_province_code VARCHAR(20),
    IN p_district_code VARCHAR(20),
    IN p_ward_code VARCHAR(20),
    IN p_address TEXT,
    IN p_bedroom INT,
    IN p_bathroom INT,
    IN p_construction_year INT,
    IN p_parking_slot INT,
    IN p_property_category ENUM('sell', 'rent', 'project'),
    IN p_category ENUM('Căn hộ chung cư', 'Nhà riêng', 'Nhà mặt phố', 'Nhà biệt thự, liền kề', 'Đất', 'Đất nền dự án', 'Trang trại', 'khu nghỉ dưỡng', 'Nhà kho, nhà xưởng', 'Bất động sản khác'),
    IN p_area DECIMAL(10, 2)
)
begin
    update property
    set
        property_name = p_property_name,
        short_desc = p_short_desc,
        detail_desc = p_detail_desc,
        price = p_price,
        province_code = p_province_code,
        district_code = p_district_code,
        ward_code = p_ward_code,
        address = p_address,
        bedroom = p_bedroom,
        bathroom = p_bathroom,
        construction_year = p_construction_year,
        parking_slot = p_parking_slot,
        property_category = p_property_category,
        category = p_category,
        area = p_area
    where property_id = p_property_id and user_id = p_user_id;
end //
DELIMITER ;

delimiter //
create procedure sp_delete_property (
    IN p_property_id INT,
    IN p_user_id INT
)
begin
    delete from property
    where property_id = p_property_id and user_id = p_user_id;
end //
delimiter ;

DELIMITER //

CREATE PROCEDURE sp_insert_property_images(
    IN p_property_id INT,
    IN p_image_urls JSON
)
BEGIN
    DECLARE image_url VARCHAR(255);
    DECLARE done INT DEFAULT FALSE;
    DECLARE image_cursor CURSOR FOR
        SELECT * FROM JSON_TABLE(p_image_urls, '$[*]' COLUMNS(image_url VARCHAR(255) PATH '$')) AS image_data;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN image_cursor;

    read_images: LOOP
        FETCH image_cursor INTO image_url;
        IF done THEN
            LEAVE read_images;
        END IF;

        INSERT INTO property_images (property_id, image_url)
        VALUES (p_property_id, image_url);
    END LOOP;

    CLOSE image_cursor;
END //

DELIMITER ;

call sp_insert_property_images(1, [
        "https://cdn.thedreamhome.click/BD.jpg",
        "https://cdn.thedreamhome.click/HCM.jpg",
        "https://cdn.thedreamhome.click/HN.jpg"]);

delimiter //
create procedure sp_get_detail_property (
    IN p_property_id INT
)
begin
    declare image_urls JSON;

    select JSON_ARRAYAGG(image_url) into image_urls
    from property_images
    where property_id = p_property_id;

    select
        pr.property_id,
        pr.user_id,
        pr.property_name,
        pr.short_desc,
        pr.detail_desc,
        pr.price,
        pr.discounted_price,
        pr.bedroom,
        pr.bathroom,
        pr.area,
        pr.construction_year,
        pr.parking_slot,
        pr.property_category,
        pr.category,
        pr.status,
        pr.expired_at,
        pr.on_sale,
        pr.created_at,
        pr.updated_at,
        d.name as district_name,
        p.name as province_name,
        w.name as ward_name,
        image_urls as image_urls,
        pr.address,
        u.user_name,
        u.user_email,
        u.user_phone,
        u.user_image
    from property pr
    left join districts d on pr.district_code = d.code
    left join provinces p on pr.province_code = p.code
    left join wards w on pr.ward_code = w.code
    left join user u on pr.user_id = u.user_id
    where pr.property_id = p_property_id;
end //
delimiter ;

DELIMITER //
CREATE PROCEDURE sp_get_interest_list(
   IN p_user_id INT
)
BEGIN
    SELECT * FROM interest
        where user_id = p_user_id;
END //
DELIMITER ;

call sp_get_interest_list(4);


delimiter //
create procedure sp_get_province_list ()
begin
    select
        *
    from provinces
    where code in ('01', '48', '74', '79');
end //
delimiter ;

delimiter //
create procedure sp_get_district_list (
    IN p_province_code VARCHAR(20)
)
begin
    select
        *
    from districts
    where province_code like concat(p_province_code, '%');
end //
delimiter ;

delimiter //
create procedure sp_get_ward_list (
    IN p_district_code VARCHAR(20)
)
begin
    select
        *
    from wards
    where district_code like concat(p_district_code, "%");
end //
delimiter ;


DELIMITER //
CREATE PROCEDURE sp_update_property_images(
    IN p_property_id INT,
    IN p_image_urls JSON
)
BEGIN
  DELETE FROM property_images WHERE property_id = p_property_id;

  INSERT INTO property_images (property_id, image_url)
  SELECT p_property_id, JSON_UNQUOTE(JSON_EXTRACT(p_image_urls, CONCAT('$[',x.num-1,']')))
  FROM (
       SELECT ROW_NUMBER() OVER () AS num
       FROM information_schema.COLUMNS WHERE TABLE_NAME IS NOT NULL
       LIMIT 30
  ) AS x;

END //
DELIMITER ;

# delimiter //
# create procedure sp_insert_interest (
#     IN p_user_id INT,
#     IN p_property_id INT
# )
# begin
#     insert into interest (user_id, property_id)
#     values (p_user_id, p_property_id);
# end //
# delimiter ;

delimiter //
create procedure sp_insert_interest (
    IN p_user_id INT,
    IN p_property_id INT
)
begin
    IF NOT EXISTS (
        SELECT * FROM interest
        WHERE user_id = p_user_id AND property_id = p_property_id
    ) THEN
        insert into interest (user_id, property_id)
        values (p_user_id, p_property_id);
    END IF;
end //
delimiter ;

delimiter //
create procedure sp_delete_interest (
    IN p_user_id INT,
    IN p_property_id INT
)
begin
    delete from interest
    where user_id = p_user_id and property_id = p_property_id;
end //
delimiter ;

delimiter //
create procedure sp_get_list_property_interest_by_user (
    IN p_user_id INT
)
begin
    select
        pr.property_id,
        pr.property_name,
        pr.price,
        pr.discounted_price,
        pr.bedroom,
        pr.bathroom,
        pr.area,
        pr.on_sale,
        d.name as district_name,
        p.name as province_name,
    (
        SELECT pi.image_url
        FROM property_images pi
        WHERE pi.property_id = pr.property_id
        LIMIT 1
    ) AS image_url
    from property pr
    left join districts d on pr.district_code = d.code
    left join provinces p on pr.province_code = p.code
    where pr.property_id in (
        select property_id
        from interest
        where user_id = p_user_id
    )
    order by pr.created_at desc;
end //
delimiter ;


delimiter //
create procedure sp_get_property_by_catagory (
    IN p_property_category ENUM('sell', 'rent', 'project'),
    IN p_page_number INT,
    IN p_records_per_page INT
)
begin
    declare offset_value INT default 0;

    set offset_value = (p_page_number - 1) * p_records_per_page;

    select
        pr.property_id,
        pr.property_name,
        pr.short_desc,
        pr.price,
        pr.discounted_price,
        pr.bedroom,
        pr.bathroom,
        pr.area,
        pr.construction_year,
        pr.parking_slot,
        pr.created_at,
        pr.expired_at,
        pr.address,
        w.name as ward_name,
        d.name as district_name,
        p.name as province_name,
        pi.image_url as image_url
    from property pr
    left join wards w on pr.ward_code = w.code
    left join districts d on pr.district_code = d.code
    left join provinces p on pr.province_code = p.code
    left join property_images pi on pr.property_id = pi.property_id
    where pr.property_category = p_property_category
    order by pr.created_at desc
    limit p_records_per_page
    offset offset_value;
end //
delimiter ;

delimiter //
create procedure sp_update_property_status (
    IN p_property_id INT,
    IN p_status enum('available', 'sold')
)
begin
    update property
    set status = p_status
    where property_id = p_property_id;
end //
delimiter ;