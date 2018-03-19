package com.natenelles.timeapp.service.impl;

import com.amazonaws.SDKGlobalConfiguration;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.natenelles.timeapp.service.intf.FileUploadService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Service
public class FileUploadServiceImpl implements FileUploadService{

    private static final Regions region = Regions.US_EAST_2;

    private final String profileImageBucketName;

    private final AmazonS3 amazonS3;

    FileUploadServiceImpl(
            @Value("${S3.profile-pic-bucket}") String profileImageBucketName,
            @Value("${S3.key-id}") String keyId,
            @Value("${S3.secret}") String secret) {

        this.profileImageBucketName = profileImageBucketName;

         BasicAWSCredentials awsCreds = new BasicAWSCredentials(keyId, secret);
         amazonS3 =
                 AmazonS3Client.builder()
                         .withRegion(region)
                         .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
                         .build();
    }


    @Override
    public URL uploadProfileImage(MultipartFile file, long userId) throws IOException{

        String key = "profile-image-" + UUID.randomUUID();

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());

        PutObjectRequest putObjectRequest =
                new PutObjectRequest(profileImageBucketName, key, file.getInputStream(), objectMetadata)
                        .withCannedAcl(CannedAccessControlList.PublicRead);
        amazonS3.putObject(putObjectRequest);
        return amazonS3.getUrl(profileImageBucketName, key);
    }
}
