package com.extgen.platform.controller;

import com.extgen.platform.model.GenerateRequest;
import com.extgen.platform.model.GenerateResponse;
import com.extgen.platform.service.ExtensionGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/extensions")
@CrossOrigin(origins = "http://localhost:3000")
public class ExtensionController {

    @Autowired
    private ExtensionGeneratorService generatorService;

    /**
     * POST /api/extensions/generate
     * Generates a browser extension from a text prompt
     */
    @PostMapping("/generate")
    public ResponseEntity<GenerateResponse> generateExtension(
            @RequestBody GenerateRequest request) {
        GenerateResponse response = generatorService.generate(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/extensions
     * Returns all generated extensions
     */
    @GetMapping
    public ResponseEntity<List<GenerateResponse>> getAllExtensions() {
        List<GenerateResponse> extensions = generatorService.getAll();
        return ResponseEntity.ok(extensions);
    }

    /**
     * GET /api/extensions/{id}
     * Returns a specific extension by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GenerateResponse> getExtension(@PathVariable String id) {
        return generatorService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/extensions/{id}
     * Deletes an extension by ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExtension(@PathVariable String id) {
        generatorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
