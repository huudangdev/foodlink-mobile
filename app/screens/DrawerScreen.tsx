import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getStoreInfo } from "../services/storeApi";

const settings = [
  {
    id: 1,
    name: "Thông tin quán",
    icon: "information-outline",
    link: "Store/StoreScreen",
  },
  {
    id: 2,
    name: "Cài đặt thông tin VNPAY",
    icon: "pencil-outline",
    link: "VNPAYSettings",
  },
  {
    id: 3,
    name: "Quản lý thực đơn",
    icon: "calendar-outline",
    link: "MenuManagement",
  },
  {
    id: 4,
    name: "Nhóm món thêm",
    icon: "plus-circle-outline",
    link: "AdditionalItems",
  },
  {
    id: 5,
    name: "Danh mục giảm giá",
    icon: "tag-outline",
    link: "DiscountCategories",
  },
  { id: 6, name: "Loại dịch vụ", icon: "apps", link: "ServiceTypes" },
];

const DrawerScreen = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { user, token, setToken, setUser } = useAuth();

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        let storeInfo = await getStoreInfo(
          user.grabFoodToken ? user.grabFoodToken : ""
        );
        if (!storeInfo) {
          storeInfo = {
            data: {
              grab_food_profile: {
                merchant: {
                  ID: "5-CZDKKFMGBCCELE",
                  name: "Green Food",
                  description: "",
                  contractNumber: "84901460814",
                  mobileNumber: "840938587191",
                  tags: null,
                  latitude: 10.807944297790527,
                  longitude: 106.75377655029297,
                  rating: 0,
                  openingHours: [
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                    {
                      ranges: [
                        {
                          start: "08:00",
                          end: "17:00",
                        },
                      ],
                    },
                  ],
                  countryID: 5,
                  cityID: 9,
                  timezone: "Asia/Ho_Chi_Minh",
                  district: "Q.2",
                  address:
                    "49 Đường Số 4, Khu Phố 4, Phường An Phú, Quân 2, Q.2, 70000",
                  tax: "0",
                  businessType: 0,
                  deliveryChargeInCents: 0,
                  minConsumeFeeInCents: 0,
                  halal: false,
                  contractDate: null,
                  expiredDate: null,
                  status: "ACTIVE",
                  isBookable: false,
                  isSupportOnline: false,
                  isAcceptSpecialOrderRequest: false,
                  editorials: null,
                  deliveryTime: 45,
                  photo:
                    "https://food-cms.grab.com/Merchants/5-CZDKKFMGBCCELE/photos/ff45c81a855f496c828e9ec3e0050789_1622406017553740305.png",
                  backgroundImg: "",
                  commission: 0,
                  grabPayID: "",
                  paymentType: 1,
                  poiID: 0,
                  webSite: "",
                  isOpen: false,
                  serviceTypeID: 1510,
                  email: "nguyenhuyen184.neu@gmail.com",
                  updatedAt: "2025-01-05T05:54:20Z",
                  createdAt: "2020-04-15T11:19:26Z",
                  closePeriodStart: "2025-01-05T05:54:20Z",
                  closePeriodEnd: "2025-01-06T05:54:20Z",
                  icon: "",
                  timezoneOffsetInSec: 28800,
                  model: "INTEGRATED",
                  cePhone: "+84869421010",
                  countryCode: "VN",
                  autoAcceptGroup: "AutoAcceptGroupA",
                  isAnalyticsDashboardEnabled: false,
                  mlmPartner: 0,
                  currency: {
                    code: "VND",
                    symbol: "₫",
                    exponent: "0",
                    exponentUnit: 0,
                  },
                  isMenuEditingEnabled: true,
                  isPromoModuleEnabled: true,
                  helpCenterUrl: {
                    "en-kh":
                      "https://help.grab.com/merchant/en-kh/360001717951",
                    "en-my":
                      "https://help.grab.com/merchant/en-my/360001717951",
                    "en-ph":
                      "https://help.grab.com/merchant/en-ph/900006612563",
                    "en-sg":
                      "https://help.grab.com/merchant/en-sg/360001717951",
                    "en-th":
                      "https://help.grab.com/merchant/en-th/360001717951",
                    "id-id": "https://food-merchant-help.grab.com/hc/id",
                    "my-mm": "https://help.grab.com/merchant/my-mm",
                    "th-th":
                      "https://help.grab.com/merchant/th-th/360001717951",
                    "vi-vn":
                      "https://help.grab.com/merchant/vi-vn/360001717951",
                  },
                  campaignHowItWorksUrl: {
                    "en-my": "https://grb.to/mex-promo-exid",
                    "en-ph": "https://grb.to/mex-promo-exid",
                    "en-sg": "https://grb.to/mex-promo-exid",
                    "en-th": "https://grb.to/mex-promo-exid",
                    "id-id": "https://grb.to/mex-promo-id",
                    "th-th":
                      "https://help.grab.com/merchant/th-th/360040807092",
                    "vi-vn": "https://grb.to/mex-promo-exid",
                  },
                  isLeadsGenHackSolutionEnabled: false,
                  isPasscodeCreated: false,
                  isPasscodeSkipped: true,
                  isPasscodeEnabled: true,
                  isPosIntegrationEnabled: false,
                  isInboxEnabled: true,
                  specialMerchantType: "",
                  supportTakeaway: false,
                  isMFCV2PartOneEnabled: true,
                  isMFCV2PartTwoEnabled: true,
                  isOrderLevelDiscountEnabled: true,
                  isScheduledOrderEnabled: true,
                  isTroyWhitelisted: true,
                  isEnableTroy: true,
                  grabPayGrabID: "8995a760-145d-4ddc-8dac-f7e6bb809702",
                  merchantFlag: {
                    isSupportNewReceipt: true,
                    isMexOptInCampaignEnabled: true,
                    isBannerVisible: true,
                    isTemperatureCardEnabled: true,
                    isMSSEnabled: true,
                    mssCampaignFeatureEnabled: {
                      isAudienceEnabled: true,
                      isDayOfWeekEnabled: true,
                      isTimeOfDayEnabled: true,
                      isKeywordsEnabled: true,
                      isCampaignTypeBannerEnabled: true,
                      isCampaignTypeSearchEnabled: true,
                    },
                    isMexEditOrderEnabled: true,
                    isTroyWholesaleEnabled: false,
                    grabMartFeatureEnabled: {},
                    posFeatureEnabled: {
                      isPosAvailabilityEnabled: true,
                    },
                    isMexCancelOrderEnabled: true,
                    isMenuInsightsEnabled: true,
                    isConcurrencyHandlingEnabled: true,
                    specialItemSettings: [
                      {
                        specialItemType: "alcohol",
                        enablePromo: true,
                        enableCampaign: true,
                        editableFields: [
                          "availableStatus",
                          "availableAt",
                          "status",
                        ],
                      },
                      {
                        specialItemType: "meal_for_one",
                        enablePromo: true,
                        enableCampaign: true,
                        enableMerchantMenuEditor: true,
                        editableFields: [
                          "availableStatus",
                          "availableAt",
                          "status",
                          "purchasable",
                          "attributes",
                          "SellingTimeID",
                        ],
                      },
                    ],
                    skipProofMenuEnabled: true,
                    menuEditorFeatureEnabled: {
                      searchDepartment: true,
                    },
                    isEdithEnabled: false,
                    isOptInCampaignEnabledV2: true,
                    isMerchantChargesEnabled: false,
                    storeFrontSettings: null,
                    isOrderListV3Enabled: true,
                    menuGroupSetting: {
                      itemEditableFields: ["item availability", "item stock"],
                    },
                    multiPicsSetting: {
                      enable: true,
                      maxSize: 4,
                    },
                    mssMarketingEntranceNewLogicEnabled: true,
                    isMssMigrateToImageAdsEnabled: false,
                    mcorV2FeatureEnabled: {
                      ExperimentGroup: "B",
                    },
                    itemWeightLimitSetting: {
                      itemWarningWeightLimit: 10000,
                      itemBlockWeightLimit: 25000,
                    },
                    hasEnabledSendSTOCollectionNotification: false,
                  },
                  isTroyUserManagementEnabled: false,
                  specialOpeningHours: null,
                  tempPause: null,
                  optInCampaignHowItWorksUrl: {
                    "en-id":
                      "https://help.grab.com/merchant/id-id/360044825332-%F0%9F%8E%A6-Fitur-Promo-Rekomendasi",
                    "en-my":
                      "https://www.grab.com/my/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "en-ph":
                      "https://www.grab.com/ph/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "en-sg":
                      "https://www.grab.com/sg/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "en-th":
                      "https://www.grab.com/th/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "id-id":
                      "https://www.grab.com/id/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "th-th":
                      "https://www.grab.com/th/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                    "vi-vn":
                      "https://www.grab.com/vn/merchant/recommended-promotions/?utm_source=inapp&utm_medium=learnmore",
                  },
                  cancelOrderHelpCenterUrl: {
                    "en-my":
                      "https://help.grab.com/merchant/en-my/360027910271-Report-a-payment-dispute",
                    "en-ph":
                      "https://docs.google.com/forms/d/e/1FAIpQLSdbIRr686x-Co9_k_irC81oCg6MLCIZMbHGEtEd_eShqRqljw/viewform",
                    "en-sg":
                      "https://help.grab.com/merchant/en-sg/360045212172",
                    "id-id":
                      "https://food-merchant-help.grab.com/hc/id/articles/360026383292-Pesanan-sudah-disiapkan-tapi-Mitra-Pengemudi-tidak-mengambil-makanan",
                    "th-th":
                      "https://help.grab.com/merchant/th-th/4608932986137",
                    "vi-vn":
                      "https://help.grab.com/merchant/vi-vn/360027893552-Yeu-cau-boi-hoan-djon-hang-HUY-cua-Quan-Ua-Thich",
                  },
                  isLeadsGenMerchant: false,
                  isEnableLeadsGenFulfill: false,
                  role: "",
                  featureFlag: 1816302259212632216,
                  busyModeConfig: {
                    busyModeFptLowerBound: 15,
                    busyModeFptUpperBound: 60,
                    busyModeApproach: 1,
                  },
                  smallPicture:
                    "https://food-cms.grab.com/Merchants/5-CZDKKFMGBCCELE/pictures/3d20e44ab0604ae684b104f769155ee7_1646654777003273150.png",
                  reviewTooltipUrl:
                    "https://help.grab.com/merchant/vi-vn/4408080591001",
                  orderHelpCenterUrl: {
                    vi: "https://help.grab.com/merchant/vi-vn/360004458172-Quan-ly-djon-hang-GrabFood",
                  },
                  blockOnDemandOrders: false,
                  storefrontEnabled: false,
                  supportDelivery: true,
                  supportDineIn: false,
                  dineInOpeningHours: [
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                    {
                      ranges: [],
                    },
                  ],
                  isDineInOpeningHoursSet: false,
                  supportScheduledOrders: true,
                  isDineInOpen: false,
                  photoExhibition: [],
                  menuTranslationSetting: null,
                  featureFlags: {
                    EnableAIDescriptionSelfServe: true,
                    enableGrabSplitLargeOrder: true,
                    enableMexAiAssistantRevamp: false,
                    fedOptimizeMenuMainItemCode: true,
                    isCashierAccountabilityEnable: true,
                    isCashierAccountabilityGroupBEnable: true,
                    isMORV3VNExperimentEnable: true,
                  },
                  locationPhoneNumbers: ["840938587191"],
                  nameTranslation: null,
                  brandNameTranslation: null,
                  isChainMerchant: false,
                  merchantUser: null,
                },
                nextOpenTime: "2025-01-10T01:00:00Z",
                updateOpeningHoursTimes: 5,
                maxOpeningPeriods: 3,
                setting: {
                  acceptCountDownInMin: 5,
                  updateOpeningHoursTimes: 5,
                  maxOpeningPeriods: 3,
                  vat: 0.1,
                  inboxMessageCount: 500,
                  campaign: {
                    itemLevel: "NONE",
                    orderLevel: "NONE",
                    freeItem: "NONE",
                    deliveryFee: "NONE",
                    serviceTypes: [
                      {
                        value: 0,
                        name: "Delivery",
                        displayName: "",
                      },
                    ],
                  },
                },
                merchantUser: {
                  appUserEmail: "",
                },
                dailyCheckIn: true,
              },
              grab_food_store_profile: {
                storeProfile: {
                  storeID: "5-CZDKKFMGBCCELE",
                  storePIC: {
                    outletEmail: "nguyenhuyen184.neu@gmail.com",
                    outletPhone: "84901460814",
                  },
                  storeLocation: {
                    coordinates: {
                      latitude: 10.807944587441913,
                      longitude: 106.7537761,
                    },
                    address:
                      "49 Đường Số 4, Khu Phố 4, Phường An Phú, Quân 2, Q.2, 70000",
                    postcode: "70000",
                    countryID: 5,
                    cityName: "Ho Chi Minh",
                    cityID: 9,
                    registeredCoordinates: {
                      latitude: 10.807944587441913,
                      longitude: 106.7537761,
                    },
                  },
                  storeName: "Green Food",
                  status: "ACTIVE",
                  secondaryStatus: "OutOfOpeningHours",
                  grabPayGrabID: "8995a760-145d-4ddc-8dac-f7e6bb809702",
                  invoiceEmail: "nguyenhuyen184.neu@gmail.com",
                  contractPhone: "",
                },
              },
              grab_pay_profile: {
                name: "Organic Store Green Food",
                currency: "",
                mobileNumber: "84936439855",
                email: "nguyenhuyen184.neu@gmail.com",
                correspondence_email: "nguyenhuyen184.neu@gmail.com",
                balance: 0,
                nmid: "",
                balanceLimit: 0,
                config: {},
                address: {
                  AddressLine1:
                    "Số 4E đường số 6, Khu Phố 4, Phường An Phú, Quận 2, thành phố Hồ Chí Minh",
                  AddressLine2:
                    "Số 4E đường số 6, Khu Phố 4, Phường An Phú, Quận 2, thành phố Hồ Chí Minh",
                  City: "Ho Chi Minh",
                  GeoLocation: {
                    latitude: "10.790000",
                    longitude: "106.703003",
                  },
                },
                bank_details: {
                  bank_name: "Techcombank",
                  account_name: "CÔNG TY TNHH THE FRESH GARDEN",
                  account_number: "....8016",
                },
                qrType: "",
                qrTypeImage: "",
                qrBackgroundImage: "",
                qrProviderImage: "",
                qrFrameImage: "",
                timezone: "",
                spring_id: "a7d14c11-8d73-40f7-a1d2-2b11a855be59",
                merchant_grab_id: "5cefa220-d055-46b2-89cb-ea8e1313f78c",
              },
              bank_details: {
                bank_name: "Techcombank",
                account_name: "CÔNG TY TNHH THE FRESH GARDEN",
                account_number: "....8016",
              },
              display_profile: null,
              gp_merchant_profile: {
                BusinessTaxIDNumber: "",
                xm_merchant_grab_id: "5cefa220-d055-46b2-89cb-ea8e1313f78c",
              },
            },
            error: null,
          };
          return;
        }
        await setUser({
          username: user?.username || "",
          grabFoodToken: user?.grabFoodToken || "",
          email: user?.email || "",
          storeInfo,
        });
        console.log("Store info:", storeInfo);
      } catch (error) {
        console.error("Error fetching store info:", error);
      }
    };
    if (user?.grabFoodToken) fetchStoreInfo();
  }, [user]);

  const stores = [
    {
      id: 1,
      name: user?.storeInfo?.data?.merchant?.name
        ? user.storeInfo.data.merchant.name
        : "Green Food",
      address: user?.storeInfo?.data?.merchant?.address
        ? user.storeInfo.data.merchant.address
        : "49 Đường Số 4, Khu Phố 4, Phường An Phú, Quân 2, Q.2, 70000",
      channels: [
        {
          id: 1,
          name: "GrabFood",
          status:
            user?.grabFoodToken && user?.grabFoodToken !== ""
              ? "Đã kết nối"
              : "Chưa kết nối",
          icon: require("../../assets/images/example-item.png"),
        },
        // {
        //   id: 2,
        //   name: "SPFood",
        //   status: "Chưa kết nối",
        //   icon: require("../../assets/images/example-item.png"),
        // },
      ],
    },
    // {
    //   id: 2,
    //   name: "GongCha 02-Lê Lợi",
    //   address: "02 - Lê Lợi",
    //   channels: [
    //     {
    //       id: 1,
    //       name: "GrabFood",
    //       status: "Đã kết nối",
    //       icon: require("../../assets/images/example-item.png"),
    //     },
    //     {
    //       id: 2,
    //       name: "SPFood",
    //       status: "Chưa kết nối",
    //       icon: require("../../assets/images/example-item.png"),
    //     },
    //   ],
    // },
  ];

  const [selectedStore, setSelectedStore] = useState(stores[0]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setPickerVisible(!isPickerVisible)}
      >
        <Image
          source={{
            uri: "https://food-cms.grab.com/Merchants/5-CZDKKFMGBCCELE/photos/ff45c81a855f496c828e9ec3e0050789_1622406017553740305.png",
          }}
          style={styles.storeImage}
        />
        <View>
          <Text style={styles.storeName}>{selectedStore.name}</Text>
          <Text style={styles.storeAddress}>{selectedStore.address}</Text>
        </View>
      </TouchableOpacity>

      {/* Store Picker */}
      {isPickerVisible && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStore.id.toString()}
            onValueChange={(itemValue) => {
              const store = stores.find(
                (store) => store.id === Number(itemValue)
              );
              if (store) {
                setSelectedStore(store);
              }
              setPickerVisible(false);
            }}
            style={styles.picker}
          >
            {stores.map((store) => (
              <Picker.Item
                key={store.id}
                label={store.name}
                value={store.id.toString()}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Menu Items */}
      <TouchableOpacity style={styles.menuItem}>
        <Icon name="star-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Đánh giá</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="bell-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Icon name="printer-outline" size={24} color="#555" />
        <Text style={styles.menuText}>Cài đặt máy in</Text>
      </TouchableOpacity>

      {/* Tích hợp kênh */}
      <Text style={styles.sectionTitle}>Tích hợp kênh</Text>
      {selectedStore.channels.map((channel) => (
        <TouchableOpacity
          key={channel.id}
          style={styles.channelItem}
          onPress={() => {
            console.log("Navigate to WebViewGrabfoodScreen");
            router.push("/screens/Auth/AuthGrabfoodScreen");
          }}
        >
          <Image source={channel.icon} style={styles.channelIcon} />
          <Text style={styles.channelName}>{channel.name}</Text>
          <Text
            style={
              channel.status === "Đã kết nối"
                ? styles.connected
                : styles.notConnected
            }
          >
            {channel.status}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Cài đặt cửa hàng */}
      <Text style={styles.sectionTitle}>Cài đặt cửa hàng</Text>
      {settings.map((setting) => (
        <TouchableOpacity
          key={setting.id}
          style={styles.menuItem}
          onPress={() => {
            router.push(`/screens/${setting.link}`);
          }}
        >
          <Icon name={setting.icon} size={24} color="#555" />
          <Text style={styles.menuText}>{setting.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  picker: { height: 50, width: "100%" },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
    marginLeft: -15,
  },
  storeImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  storeName: { fontSize: 18, fontWeight: "bold" },
  storeAddress: { fontSize: 14, color: "#555" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuText: { marginLeft: 10, fontSize: 16, color: "#333" },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  channelItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  channelIcon: { width: 30, height: 30, marginRight: 10 },
  channelName: { flex: 1, fontSize: 16, color: "#333" },
  connected: { color: "green", fontWeight: "bold" },
  notConnected: { color: "gray" },
});

export default DrawerScreen;
