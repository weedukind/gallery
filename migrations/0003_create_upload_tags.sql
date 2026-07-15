CREATE TABLE upload_tags (
    upload_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (upload_id, tag_id),
    KEY fk_upload_tags_tag (tag_id),
    CONSTRAINT fk_upload_tags_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
    CONSTRAINT fk_upload_tags_upload FOREIGN KEY (upload_id) REFERENCES uploads (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
