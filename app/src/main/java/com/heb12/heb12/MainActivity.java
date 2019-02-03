package com.heb12.heb12;

import android.content.Context;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebViewClient;
import android.widget.Toast;
import java.io.File;
import java.io.*;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;


public class MainActivity extends AppCompatActivity {

    private WebView view;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Create Heb12 config file if not already created
        FileOutputStream outputStream;
        try {
            outputStream = openFileOutput("fart.txt", Context.MODE_PRIVATE);
            outputStream.write("hehe".getBytes());
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Load the files in the webview
        WebView view = (WebView) findViewById(R.id.WebView);
        view.getSettings().setJavaScriptEnabled(true);
        view.loadUrl("file:///android_asset/index.html?['default','default']");
        getSupportActionBar().hide();

        // Add a Javascript interface
        view.addJavascriptInterface(new JavaScriptInterface(), "interface");
    }

    // Update settings --- cool thingy: Toast.makeText(MainActivity.this, data, Toast.LENGTH_SHORT).show();
    private class JavaScriptInterface {
        @JavascriptInterface
        public void updateSetting(String type, String data) {
            if (type.equals("other")) {
                if (data.equals("close")) {
                    finish();
                }

            }
        }
    }
}
