package com.heb12.heb12;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Load the files in the webview
        WebView view = (WebView) findViewById(R.id.WebView);
        view.getSettings().setJavaScriptEnabled(true);
        view.loadUrl("file:///android_asset/index.html?['default','default']");
        getSupportActionBar().hide();

        // Code to update the config file
       /*
       Hehe I'm too lazy to do any of this.
       */
    }
}
