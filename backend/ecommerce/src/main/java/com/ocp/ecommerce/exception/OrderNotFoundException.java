package com.ocp.ecommerce.exception;

public class OrderNotFoundException extends RuntimeException{
    public  OrderNotFoundException(String message){
        super(message);
    }
}
