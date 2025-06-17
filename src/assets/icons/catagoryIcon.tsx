"use client";

import {
    AiFillBank,
    AiOutlineAppstoreAdd,
    AiOutlinePercentage,
    AiTwotoneUsb,
} from "react-icons/ai";
import {
    BiCloudRain,
    BiDna,
    BiSolidChalkboard,
    BiSolidParking,
    BiSolidPrinter,
} from "react-icons/bi";
import {
    BsBackpack2Fill,
    BsBusFront,
    BsCurrencyDollar,
    BsFillGiftFill,
    BsFillHeartFill,
    BsFillSafeFill,
    BsFillUmbrellaFill,
    BsFuelPumpFill,
    BsPiggyBankFill,
} from "react-icons/bs";
import { CiBurger, CiPill } from "react-icons/ci";
import {
    FaAmbulance,
    FaBinoculars,
    FaBook,
    FaCamera,
    FaCameraRetro,
    FaCompass,
    FaFilm,
    FaFirstAid,
    FaGraduationCap,
    FaGuitar,
    FaHeadphones,
    FaHiking,
    FaLaptopCode,
    FaLeaf,
    FaMapMarkedAlt,
    FaMicrophone,
    FaMoon,
    FaMountain,
    FaPallet,
    FaPassport,
    FaPencilRuler,
    FaPumpSoap,
    FaRegCreditCard,
    FaSchool,
    FaSuitcaseRolling,
    FaUmbrellaBeach,
} from "react-icons/fa";
import {
    FaBasketShopping,
    FaCarRear,
    FaLightbulb,
    FaMotorcycle,
    FaPencil,
    FaPlugCircleBolt,
    FaStethoscope,
    FaTaxi,
    FaToolbox,
} from "react-icons/fa6";
import {
    GiBasket,
    GiBigDiamondRing,
    GiCampfire,
    GiChimney,
    GiClothes,
    GiComb,
    GiCupcake,
    GiFireFlower,
    GiFlowerEmblem,
    GiLipstick,
    GiMicroscope,
    GiMirrorMirror,
    GiShinyApple,
    GiShoppingBag,
    GiSyringe,
    GiToothbrush,
    GiTowel,
    GiWallet,
    GiWashingMachine,
    GiWaterBottle,
} from "react-icons/gi";
import { ImSpoonKnife } from "react-icons/im";
import {
    IoMdBicycle,
    IoMdCalculator,
    IoMdCash,
    IoMdPricetags,
    IoMdTrain,
    IoMdWine,
} from "react-icons/io";
import {
    IoBandage,
    IoBarChart,
    IoBed,
    IoFish,
    IoMusicalNotesSharp,
    IoReceipt,
    IoStorefront,
    IoWater,
} from "react-icons/io5";
import { LuBitcoin, LuNotebook, LuShip, LuTentTree } from "react-icons/lu";
import {
    MdBloodtype,
    MdConnectedTv,
    MdSatelliteAlt,
    MdSignalWifiStatusbarConnectedNoInternet3,
} from "react-icons/md";
import {
    PiCoffeeDuotone,
    PiCouchFill,
    PiHospitalFill,
    PiPhoneCallFill,
    PiPopcornBold,
    PiSignInBold,
    PiSignOutBold,
} from "react-icons/pi";
import { RiBeerFill, RiPaintBrushFill, RiScissors2Fill } from "react-icons/ri";
import { SiBuymeacoffee } from "react-icons/si";
import {
    TbHomeFilled,
    TbPerfume,
    TbPizzaFilled,
    TbTransfer,
} from "react-icons/tb";
import {
    TiDeviceTablet,
    TiPlane,
    TiShoppingCart,
    TiStopwatch,
    TiWeatherPartlySunny,
} from "react-icons/ti";

import { GrGamepad } from "react-icons/gr";
import { HiOutlineSpeakerphone, HiOutlineTicket } from "react-icons/hi";
import { SlGraph } from "react-icons/sl";

import { FcClapperboard } from "react-icons/fc";

export const iconList = [
    // Food & Dining
    "fork-and-spoon",
    "burger",
    "pizza",
    "coffee",
    "ice-cream",
    "cake",
    "beer",
    "wine",
    "sushi",
    "apple",

    // Shopping
    "shopping-cart",
    "trolly",
    "bag",
    "gift",
    "basket",
    "tag",
    "percent",
    "receipt",
    "store",
    "barcode",

    // Transportation
    "car",
    "motorcycle",
    "bus",
    "train",
    "plane",
    "ship",
    "bicycle",
    "taxi",
    "fuel",
    "parking",

    // Home & Utilities
    "home",
    "light-bulb",
    "water-drop",
    "couch",
    "bed",
    "washing-machine",
    "toolbox",
    "paint-brush",
    "chimney",
    "plug",

    // Healthcare
    "heart",
    "hospital",
    "stethoscope",
    "pill",
    "syringe",
    "bandage",
    "first-aid-kit",
    "dna",
    "blood",
    "ambulance",

    // Technology
    "phone",
    "laptop",
    "tablet",
    "camera",
    "watch",
    "printer",
    "headphones",
    "usb",
    "wifi",
    "satellite",

    // Finance
    "calculator",
    "dollar",
    "coin",
    "wallet",
    "credit-card",
    "safe",
    "piggy-bank",
    "bank",
    "cash",
    "chart-line",

    // Entertainment
    "guitar",
    "microphone",
    "speaker",
    "gamepad",
    "ticket",
    "clapperboard",
    "popcorn",
    "tv",
    "film",
    "music-note",

    // Personal Care
    "ring",
    "lipstick",
    "perfume",
    "comb",
    "scissors",
    "mirror",
    "toothbrush",
    "shampoo",
    "towel",
    "soap",

    // Education
    "book",
    "pencil",
    "graduation-cap",
    "school",
    "chalkboard",
    "notebook",
    "ruler",
    "backpack",
    "microscope",
    "palette",

    // Others
    "graph",
    "clothes",
    "sun",
    "moon",
    "cloud",
    "umbrella",
    "mountain",
    "flower",
    "leaf",
    "fire",

    // Travel & Leisure
    "map",
    "camera-retro",
    "binoculars",
    "passport",
    "tent",
    "suitcase",
    "compass",
    "hiking",
    "beach",
    "campfire",
    "inbound",
    "outbound",
    "transfer",
];

type IconName = (typeof iconList)[number];

const CategoryIcon = ({
    icon,
    className = "h-5 w-5",
}: {
    icon: string;
    className?: string;
}) => {
    if (!icon) return null;
    switch (icon) {
        case "fork-and-spoon":
            return <ImSpoonKnife className={className} />;

        case "burger":
            return <CiBurger className={className} />;

        case "pizza":
            return <TbPizzaFilled className={className} />;

        case "coffee":
            return <PiCoffeeDuotone className={className} />;

        case "ice-cream":
            return <SiBuymeacoffee className={className} />;

        case "cake":
            return <GiCupcake className={className} />;

        case "beer":
            return <RiBeerFill className={className} />;

        case "wine":
            return <IoMdWine className={className} />;

        case "sushi":
            return <IoFish className={className} />;

        case "apple":
            return <GiShinyApple className={className} />;

        case "shopping-cart":
            return <FaBasketShopping className={className} />;

        case "trolly":
            return <TiShoppingCart className={className} />;

        case "bag":
            return <GiShoppingBag className={className} />;

        case "gift":
            return <BsFillGiftFill className={className} />;

        case "basket":
            return <GiBasket className={className} />;

        case "tag":
            return <IoMdPricetags className={className} />;

        case "percent":
            return <AiOutlinePercentage className={className} />;

        case "receipt":
            return <IoReceipt className={className} />;

        case "store":
            return <IoStorefront className={className} />;

        case "barcode":
            return <AiOutlineAppstoreAdd className={className} />;

        case "car":
            return <FaCarRear className={className} />;

        case "motorcycle":
            return <FaMotorcycle className={className} />;

        case "bus":
            return <BsBusFront className={className} />;

        case "train":
            return <IoMdTrain className={className} />;

        case "plane":
            return <TiPlane className={className} />;

        case "ship":
            return <LuShip className={className} />;

        case "bicycle":
            return <IoMdBicycle className={className} />;

        case "taxi":
            return <FaTaxi className={className} />;

        case "fuel":
            return <BsFuelPumpFill className={className} />;

        case "parking":
            return <BiSolidParking className={className} />;

        case "home":
            return <TbHomeFilled className={className} />;

        case "light-bulb":
            return <FaLightbulb className={className} />;

        case "water-drop":
            return <IoWater className={className} />;

        case "couch":
            return <PiCouchFill className={className} />;

        case "bed":
            return <IoBed className={className} />;

        case "washing-machine":
            return <GiWashingMachine className={className} />;

        case "toolbox":
            return <FaToolbox className={className} />;

        case "paint-brush":
            return <RiPaintBrushFill className={className} />;

        case "chimney":
            return <GiChimney className={className} />;

        case "plug":
            return <FaPlugCircleBolt className={className} />;

        case "heart":
            return <BsFillHeartFill className={className} />;

        case "hospital":
            return <PiHospitalFill className={className} />;

        case "stethoscope":
            return <FaStethoscope className={className} />;

        case "pill":
            return <CiPill className={className} />;

        case "syringe":
            return <GiSyringe className={className} />;

        case "bandage":
            return <IoBandage className={className} />;

        case "first-aid-kit":
            return <FaFirstAid className={className} />;

        case "dna":
            return <BiDna className={className} />;

        case "blood":
            return <MdBloodtype className={className} />;

        case "ambulance":
            return <FaAmbulance className={className} />;

        case "phone":
            return <PiPhoneCallFill className={className} />;

        case "laptop":
            return <FaLaptopCode className={className} />;

        case "tablet":
            return <TiDeviceTablet className={className} />;

        case "camera":
            return <FaCamera className={className} />;

        case "watch":
            return <TiStopwatch className={className} />;

        case "printer":
            return <BiSolidPrinter className={className} />;

        case "headphones":
            return <FaHeadphones className={className} />;

        case "usb":
            return <AiTwotoneUsb className={className} />;

        case "wifi":
            return (
                <MdSignalWifiStatusbarConnectedNoInternet3
                    height={className}
                    width={className}
                />
            );

        case "satellite":
            return <MdSatelliteAlt className={className} />;

        case "calculator":
            return <IoMdCalculator className={className} />;

        case "dollar":
            return <BsCurrencyDollar className={className} />;

        case "coin":
            return <LuBitcoin className={className} />;

        case "wallet":
            return <GiWallet className={className} />;

        case "credit-card":
            return <FaRegCreditCard className={className} />;

        case "safe":
            return <BsFillSafeFill className={className} />;

        case "piggy-bank":
            return <BsPiggyBankFill className={className} />;

        case "bank":
            return <AiFillBank className={className} />;

        case "cash":
            return <IoMdCash className={className} />;

        case "chart-line":
            return <IoBarChart className={className} />;

        case "guitar":
            return <FaGuitar className={className} />;

        case "microphone":
            return <FaMicrophone className={className} />;

        case "speaker":
            return <HiOutlineSpeakerphone className={className} />;

        case "gamepad":
            return <GrGamepad className={className} />;

        case "ticket":
            return <HiOutlineTicket className={className} />;

        case "clapperboard":
            return <FcClapperboard className={className} />;

        case "popcorn":
            return <PiPopcornBold className={className} />;

        case "tv":
            return <MdConnectedTv className={className} />;

        case "film":
            return <FaFilm className={className} />;

        case "music-note":
            return <IoMusicalNotesSharp className={className} />;

        case "ring":
            return <GiBigDiamondRing className={className} />;

        case "lipstick":
            return <GiLipstick className={className} />;

        case "perfume":
            return <TbPerfume className={className} />;

        case "comb":
            return <GiComb className={className} />;

        case "scissors":
            return <RiScissors2Fill className={className} />;

        case "mirror":
            return <GiMirrorMirror className={className} />;

        case "toothbrush":
            return <GiToothbrush className={className} />;

        case "shampoo":
            return <GiWaterBottle className={className} />;

        case "towel":
            return <GiTowel className={className} />;

        case "soap":
            return <FaPumpSoap className={className} />;

        case "book":
            return <FaBook className={className} />;

        case "pencil":
            return <FaPencil className={className} />;

        case "graduation-cap":
            return <FaGraduationCap className={className} />;

        case "school":
            return <FaSchool className={className} />;

        case "chalkboard":
            return <BiSolidChalkboard className={className} />;

        case "notebook":
            return <LuNotebook className={className} />;

        case "ruler":
            return <FaPencilRuler className={className} />;

        case "backpack":
            return <BsBackpack2Fill className={className} />;

        case "microscope":
            return <GiMicroscope className={className} />;

        case "palette":
            return <FaPallet className={className} />;

        case "graph":
            return <SlGraph className={className} />;

        case "clothes":
            return <GiClothes className={className} />;

        case "sun":
            return <TiWeatherPartlySunny className={className} />;

        case "moon":
            return <FaMoon className={className} />;

        case "cloud":
            return <BiCloudRain className={className} />;

        case "umbrella":
            return <BsFillUmbrellaFill className={className} />;

        case "mountain":
            return <FaMountain className={className} />;

        case "flower":
            return <GiFlowerEmblem className={className} />;

        case "leaf":
            return <FaLeaf className={className} />;

        case "fire":
            return <GiFireFlower className={className} />;

        case "map":
            return <FaMapMarkedAlt className={className} />;

        case "camera-retro":
            return <FaCameraRetro className={className} />;

        case "binoculars":
            return <FaBinoculars className={className} />;

        case "passport":
            return <FaPassport className={className} />;

        case "tent":
            return <LuTentTree className={className} />;

        case "suitcase":
            return <FaSuitcaseRolling className={className} />;

        case "compass":
            return <FaCompass className={className} />;

        case "hiking":
            return <FaHiking className={className} />;

        case "beach":
            return <FaUmbrellaBeach className={className} />;

        case "campfire":
            return <GiCampfire className={className} />;

        case "inbound":
            return <PiSignInBold className={className} />;

        case "outbound":
            return <PiSignOutBold className={className} />;

        case "transfer":
            return <TbTransfer className={className} />;

        default:
            return <GiWallet className={className} />;
    }
};

export default CategoryIcon;
