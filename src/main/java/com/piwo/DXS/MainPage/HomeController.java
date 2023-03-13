package com.piwo.DXS.MainPage;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @RequestMapping("/")
    public String getGreeting(){
        return "Hello world";
    }
}