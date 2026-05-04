package com.extgen.platform.model;

// ---- GenerateRequest.java ----
// Request model for the /generate endpoint

public class GenerateRequest {
    private String prompt;
    private String browser;   // Chrome, Firefox, Edge
    private String category;  // Productivity, Accessibility, etc.

    // Constructors
    public GenerateRequest() {}

    public GenerateRequest(String prompt, String browser, String category) {
        this.prompt = prompt;
        this.browser = browser;
        this.category = category;
    }

    // Getters and Setters
    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    @Override
    public String toString() {
        return "GenerateRequest{prompt='" + prompt + "', browser='" + browser
                + "', category='" + category + "'}";
    }
}
