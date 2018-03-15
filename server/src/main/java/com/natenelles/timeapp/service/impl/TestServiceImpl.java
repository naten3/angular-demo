package com.natenelles.timeapp.service.impl;

import com.natenelles.timeapp.model.Message;
import com.natenelles.timeapp.service.intf.TestService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TestServiceImpl implements TestService {

	public List<Message> test() {
        ArrayList<Message> messages = new ArrayList<Message>();

        messages.add(new Message("Message1", "Hello, world!"));
        messages.add(new Message("Message2", "Another one!"));

        return messages;
    }

}
