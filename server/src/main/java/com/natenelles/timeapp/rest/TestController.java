package com.natenelles.timeapp.rest;

import com.natenelles.timeapp.model.Message;
import org.springframework.web.bind.annotation.*;

import com.natenelles.timeapp.service.intf.TestService;

import java.util.List;

@RestController
public class TestController {

	private TestService testService;

	public TestController(TestService testService) {
	    this.testService = testService;
    }

	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(value="/test/get/json", method=RequestMethod.GET, produces="application/json")
	public @ResponseBody List<Message> testGetJson() {
	    return this.testService.test();
	}
}
