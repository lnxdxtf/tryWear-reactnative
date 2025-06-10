import { ImageShowMain } from "@/components/ImageShow";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Index() {

  return (
    <ScrollView
      style={{
        gap: 20,
      }}
    >
      <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>

      <ImageShowMain src="Clothes1" alt="trywear-clothes-1" width={250} height={250}  />

      <Text style={{width:300, textAlign:"center", fontSize: 32, color: "#ffffff"}}>Try on clothes virtually</Text>
      <Text style={{fontSize: 18, color: "#ffffff", marginTop: 10, width: 320}}>
        See how any outfit looks on you — from a single photo. Upload your photo and the clothing item you want to try.
        Our AI blends them seamlessly to show you a realistic preview in seconds.
        Experience the future of fashion with smarter, faster, and more confident shopping decisions. 
      </Text>

      <ImageShowMain src="Clothes2" alt="trywear-clothes-2" width={250} height={250}  />

      <Pressable
        onPress={() => router.push("/prompt")}
        style={{
          backgroundColor: "#46494C",
          margin: 20,
          marginBottom: 50,
          borderRadius: 10,
          padding: 10,
          elevation: 2,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 24,
            padding: 10,
            textAlign: "center",
          }}
        >
          Try it now!
        </Text>
      </Pressable>
      </View>

    </ScrollView>
  );
}
 