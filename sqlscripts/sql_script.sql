CREATE TABLE user (
    user_id INT AUTO_INCREMENT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    user_phone VARCHAR(255),
    user_image VARCHAR(255),
    user_role ENUM('admin','user','reseller','investor') default 'user',
    user_created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY(user_id)
);

CREATE TABLE property (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_name VARCHAR(255) NOT NULL,
    short_desc TEXT,
    detail_desc TEXT,
    price DECIMAL(15, 2),
    discounted_price DECIMAL(15, 2) default 0,
    province_code VARCHAR(20) NOT NULL,
    district_code VARCHAR(20) NOT NULL,
    ward_code VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    bedroom INT,
    bathroom INT,
    construction_year INT,
    parking_slot INT,
    posting_date DATE,
    expiry_date DATE,
    property_category ENUM('sell', 'rent', 'project'),
    category ENUM('Căn hộ chung cư', 'Nhà riêng', 'Nhà mặt phố', 'Nhà biệt thự, liền kề', 'Đất', 'Đất nền dự án', 'Trang trại', 'khu nghỉ dưỡng', 'Nhà kho, nhà xưởng', 'Bất động sản khác'),
    status ENUM('available', 'sold') default 'available',
    area DECIMAL(10, 2),
    on_sale BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (province_code) REFERENCES provinces(code),
    FOREIGN KEY (district_code) REFERENCES districts(code),
    FOREIGN KEY (ward_code) REFERENCES wards(code),
    CHECK (province_code IS NOT NULL AND district_code IS NOT NULL AND ward_code IS NOT NULL)
);

CREATE TABLE property_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    property_id INT,
    image_url VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES property(property_id)
);

CREATE TABLE interest (
    interest_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    property_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (property_id) REFERENCES property(property_id)
);

