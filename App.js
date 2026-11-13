import React,{useEffect,useState} from 'react';
import {SafeAreaView,View,Text,TextInput,Pressable,FlatList,NativeModules,StyleSheet,Alert} from 'react-native';
const {NotificationReader}=NativeModules;
export default function App(){
 const [items,setItems]=useState([]),[q,setQ]=useState('');
 const refresh=async()=>{try{setItems(await NotificationReader.getNotifications());}catch(e){Alert.alert('Error',String(e));}};
 useEffect(()=>{refresh();},[]);
 const clear=()=>Alert.alert('Clear history?','Delete saved notifications from this phone?',[
  {text:'Cancel',style:'cancel'},{text:'Clear',style:'destructive',onPress:async()=>{await NotificationReader.clearNotifications();refresh();}}
 ]);
 const filtered=items.filter(x=>(x.app+' '+x.title+' '+x.message+' '+x.time).toLowerCase().includes(q.toLowerCase()));
 return <SafeAreaView style={s.page}>
  <Text style={s.h}>Notification Reader</Text><Text style={s.sub}>Instagram + WhatsApp · Local storage only</Text>
  <Text style={s.info}>Enable Android Notification Access below. Only previews shown in notifications can be captured. No cloud upload.</Text>
  <Pressable style={s.btn} onPress={()=>NotificationReader.openNotificationSettings()}><Text style={s.btnt}>Enable Notification Access</Text></Pressable>
  <TextInput style={s.search} placeholder="Search notifications" value={q} onChangeText={setQ}/>
  <View style={s.row}><Text style={s.sub}>{filtered.length} notification(s)</Text><View style={s.row}><Text onPress={refresh} style={s.link}>Refresh</Text><Text onPress={clear} style={[s.link,{color:'#B42318'}]}>Clear</Text></View></View>
  <FlatList data={filtered} keyExtractor={(x,i)=>(x.id||x.time||'n')+i} ListEmptyComponent={<Text style={s.empty}>No notifications saved yet. Enable access and wait for a new Instagram or WhatsApp notification.</Text>} renderItem={({item})=><View style={s.card}><View style={s.row}><Text style={s.app}>{item.app}</Text><Text style={s.time}>{item.time}</Text></View><Text style={s.title}>{item.title}</Text><Text style={s.msg}>{item.message}</Text></View>}/>
 </SafeAreaView>;
}
const s=StyleSheet.create({page:{flex:1,backgroundColor:'#F5F7FB',padding:18},h:{fontSize:25,fontWeight:'800',color:'#14213D'},sub:{color:'#667085',fontSize:13,marginTop:5},info:{backgroundColor:'#E8F1FF',color:'#24446D',padding:12,borderRadius:10,marginTop:16,lineHeight:19},btn:{backgroundColor:'#2457D6',padding:14,borderRadius:10,alignItems:'center',marginTop:12},btnt:{color:'white',fontWeight:'700'},search:{backgroundColor:'white',padding:12,borderRadius:10,marginTop:14},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:14,marginVertical:10},link:{color:'#2457D6',fontWeight:'700'},card:{backgroundColor:'white',padding:14,borderRadius:10,marginBottom:9},app:{color:'#2457D6',fontWeight:'800'},time:{color:'#98A2B3',fontSize:10},title:{fontWeight:'700',color:'#14213D',marginTop:7},msg:{color:'#475467',marginTop:5,lineHeight:20},empty:{textAlign:'center',color:'#667085',marginTop:50,lineHeight:22}});