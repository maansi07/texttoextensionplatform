package com.extgen.platform.model;

import java.time.LocalDateTime;
import java.util.Map;

public class GenerateResponse {
    private String id;
    private String name;
    private String description;
    private String browser;
    private String category;
    private String status;
    private Map<String, String> files;  // filename -> content
    private LocalDateTime createdAt;

    public GenerateResponse() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, String> getFiles() { return files; }
    public void setFiles(Map<String, String> files) { this.files = files; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
