package com.natenelles.timeapp.service.intf;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;

public interface FileUploadService {
    URL uploadProfileImage(MultipartFile file) throws IOException;
}
