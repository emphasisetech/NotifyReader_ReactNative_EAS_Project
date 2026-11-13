const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins'); const fs = require('fs'), path = require('path');
const service = `package com.example.notifyreader;
import android.service.notification.*;import android.app.Notification;import android.os.Bundle;import android.content.SharedPreferences;import org.json.*;import java.text.SimpleDateFormat;import java.util.*;
public class NotificationCaptureService extends NotificationListenerService{
 public void onNotificationPosted(StatusBarNotification sbn){
 String p=sbn.getPackageName();if(!p.equals("com.whatsapp")&&!p.equals("com.instagram.android"))return;
 Notification n=sbn.getNotification();if(n==null||n.extras==null)return;Bundle e=n.extras;
 CharSequence t=e.getCharSequence(Notification.EXTRA_TITLE),b=e.getCharSequence(Notification.EXTRA_BIG_TEXT);if(b==null)b=e.getCharSequence(Notification.EXTRA_TEXT);
 String title=t==null?"":t.toString(),msg=b==null?"":b.toString();if(title.isEmpty()&&msg.isEmpty())return;
 try{SharedPreferences pref=getSharedPreferences("notify_reader",0);JSONArray a=new JSONArray(pref.getString("items","[]"));JSONObject o=new JSONObject();o.put("id",sbn.getKey());o.put("app",p.equals("com.whatsapp")?"WhatsApp":"Instagram");o.put("title",title);o.put("message",msg);o.put("time",new SimpleDateFormat("yyyy-MM-dd HH:mm:ss",Locale.getDefault()).format(new Date(sbn.getPostTime())));a.put(o);JSONArray keep=new JSONArray();for(int i=Math.max(0,a.length()-200);i<a.length();i++)keep.put(a.get(i));pref.edit().putString("items",keep.toString()).apply();}catch(Exception ignored){}
 }} `;
const moduleJava = `package com.example.notifyreader;
import android.content.Intent;import android.provider.Settings;import com.facebook.react.bridge.*;import org.json.*;
public class NotificationReaderModule extends ReactContextBaseJavaModule{
 NotificationReaderModule(ReactApplicationContext c){super(c);}public String getName(){return "NotificationReader";}
 @ReactMethod public void getNotifications(Promise p){try{JSONArray a=new JSONArray(getReactApplicationContext().getSharedPreferences("notify_reader",0).getString("items","[]"));WritableArray out=Arguments.createArray();for(int i=0;i<a.length();i++){JSONObject o=a.getJSONObject(i);WritableMap m=Arguments.createMap();m.putString("id",o.optString("id"));m.putString("app",o.optString("app"));m.putString("title",o.optString("title"));m.putString("message",o.optString("message"));m.putString("time",o.optString("time"));out.pushMap(m);}p.resolve(out);}catch(Exception e){p.reject("READ",e);}}
 @ReactMethod public void clearNotifications(Promise p){getReactApplicationContext().getSharedPreferences("notify_reader",0).edit().remove("items").apply();p.resolve(true);}
 @ReactMethod public void openNotificationSettings(Promise p){try{Intent i=new Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS);i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);getReactApplicationContext().startActivity(i);p.resolve(true);}catch(Exception e){p.reject("SETTINGS",e);}}
}`;
const pkg = `package com.example.notifyreader;
import com.facebook.react.*;import com.facebook.react.bridge.*;import com.facebook.react.uimanager.ViewManager;import java.util.*;
public class NotificationReaderPackage implements ReactPackage{
 public List<NativeModule> createNativeModules(ReactApplicationContext c){return Arrays.<NativeModule>asList(new NotificationReaderModule(c));}
 public List<ViewManager> createViewManagers(ReactApplicationContext c){return Collections.emptyList();}
}`;
module.exports = function (config) {
    config = withAndroidManifest(config, c => { const a = c.modResults.manifest.application[0]; a.service = a.service || []; a.service.push({ $: { "android:name": ".NotificationCaptureService", "android:label": "Notification Reader", "android:permission": "android.permission.BIND_NOTIFICATION_LISTENER_SERVICE", "android:exported": "true" }, "intent-filter": [{ action: [{ $: { "android:name": "android.service.notification.NotificationListenerService" } }] }] }); return c; });
    return withDangerousMod(config, ['android', async c => {
        const d = path.join(c.modRequest.platformProjectRoot, 'app/src/main/java/com/example/notifyreader'); fs.mkdirSync(d, { recursive: true });
        fs.writeFileSync(path.join(d, 'NotificationCaptureService.java'), service); fs.writeFileSync(path.join(d, 'NotificationReaderModule.java'), moduleJava); fs.writeFileSync(path.join(d, 'NotificationReaderPackage.java'), pkg);
        const k = path.join(c.modRequest.platformProjectRoot, 'app/src/main/java/com/example/notifyreader/MainApplication.kt');
        if (fs.existsSync(k)) { let x = fs.readFileSync(k, 'utf8'); if (!x.includes('NotificationReaderPackage')) { x = x.replace(/PackageList\(this\)\.packages\.apply\s*\{/, 'PackageList(this).packages.apply {\n              add(com.example.notifyreader.NotificationReaderPackage())'); fs.writeFileSync(k, x); } }
        return c;
    }]);
};