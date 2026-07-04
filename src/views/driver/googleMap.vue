<template>
    <ion-card >
      <GoogleMap
        :api-key="mapKey"
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="12"
      >
        <Polyline :options="polylinePath" />
      </GoogleMap>
    </ion-card>
  </template>
  <script lang="ts">
  import { defineComponent } from "vue";
  import { IonCard } from "@ionic/vue";
  import { GoogleMap, Marker, Polyline } from "vue3-google-map";
  import myorders from "@/services/Myorders";
  
  export default defineComponent({
    name: "GoogleMapTracker",
    components: {
      IonCard,
      GoogleMap,
      Marker,
      Polyline
    },
    props: ['myLocation', "destinationName"],
    data() {
      return {
        mapKey: "AIzaSyATWJJptsF1uqMYKxxAQ8KB64lL7GZ2amc",
        showMap: false,
        center: { lat: 0, lng: -180 }, // Default center coordinates
        zoom: 18,
        origin: 'telangana,india', // defualt settings
        destination: 'hyderabad',// defualt settings
        polyline: <any>[],
        polylinePath: {}
      };
    },
    mounted() {
      this.center = this.myLocation;
      this.getPlaceName();
    },
    methods: {
      async getPlaceName() {
        try {
          const placeName = await myorders.getPlaceNameByLatLng(this.myLocation.lat, this.myLocation.lng);
          if (placeName) {
            this.origin = placeName;
            this.destination = this.destinationName;
            this.initiateMap();
          }
        } catch (error) {
          console.error('Error fetching place:', error);
        }
      },
      async initiateMap() {
        try {
          const polyline = await myorders.getDirections(this.origin, this.destination);
          this.polyline = this.decodePolyline(polyline);
          this.polylinePath = {
            path: this.polyline,
            geodesic: true,
            strokeColor: '#002263',
            strokeOpacity: 1.0,
            strokeWeight: 8,
          }
  
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
        this.showMap = true;
      },
      decodePolyline(encoded: any) {
        let index = 0;
        const len = encoded.length;
        let lat = 0;
        let lng = 0;
        const polyline = [];
  
        while (index < len) {
          let b;
          let shift = 0;
          let result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
  
          const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lat += dlat;
  
          shift = 0;
          result = 0;
          do {
            b = encoded.charAt(index++).charCodeAt(0) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
          } while (b >= 0x20);
  
          const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
          lng += dlng;
  
          polyline.push({ lat: lat / 1e5, lng: lng / 1e5 });
        }
  
        return polyline;
      }
    },
  });
  </script>
  <style scoped>
  #map {
    height: 100%;
  }
  </style>