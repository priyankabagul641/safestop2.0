import {StyleSheet} from 'react-native';
import colors from '../constants/colors';
import {moderateScale, verticalScale} from '../helpers/ResponsiveFonts';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Color, FontFamily} from '../globelstyle/globelstyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    color: colors.inputLabelColor,
    marginLeft: moderateScale(20),
    marginTop: moderateScale(20),
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentView: {
    flex: 1,
    backgroundColor: '#FFECD1',
  },
  flatlistcontainer: {
    marginTop: verticalScale(15),
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#15616D',
    height: 150,
    width: '100%',
  },
  userDetailsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: moderateScale(5),
  },
  mainContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 20,
  },
  title: {
    fontSize: moderateScale(25),
    fontWeight: '700',
    color: '#15616D',
    fontFamily: FontFamily.dMSansBold,
  },
  addresstxt: {
    fontSize: moderateScale(14),
    color: colors.inputLabelColor,
    marginTop: 5,
  },
  profilebutton: {
    backgroundColor: colors.purpal,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    marginHorizontal: moderateScale(15),
  },
  addressicon: {
    height: moderateScale(15),
    width: moderateScale(15),
    marginRight: moderateScale(10),
  },
  chatbutton: {
    backgroundColor: colors.DarkYellow,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
  },
  profileimage: {
    tintColor: colors.White,
    height: moderateScale(20),
    width: moderateScale(20),
  },
  AddButton: {
    backgroundColor: colors.Blue,
    height: moderateScale(50),
    width: moderateScale(50),
    position: 'absolute',
    right: moderateScale(30),
    bottom: moderateScale(30),
    borderRadius: moderateScale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonView: {
    marginTop: moderateScale(30),
    marginHorizontal: '30%',
    justifyContent: 'center',
  },

  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
  },
  mutedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b6b6b',
    textAlign: 'center',
    marginTop: 10,
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 36,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  iconConatiner: {
    backgroundColor: 'blue',
    borderRadius: 50,
    padding: 10,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconConatinerEnd: {
    backgroundColor: 'red',
    borderRadius: 50,
    padding: 10,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputView: {
    borderRadius: 8,
    borderWidth: moderateScale(0.4),
    borderColor: colors.borderColor,
    // height: hp(6),
    marginBottom: moderateScale(2),
    margin: moderateScale(2),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.65,

    elevation: 10,
    borderRadius: moderateScale(2),
  },
  frameParent: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(5),
  },
  titleView: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: responsiveHeight(5),
  },

  frameChild: {
    width: responsiveWidth(2.5),
    height: responsiveHeight(4),
  },
  nearbyImage: {
    width: 30,
    height: 36,
    marginLeft: 2,
  },
  safeStop: {
    left: responsiveWidth(2),
    fontSize: responsiveFontSize(5),
    color: Color.teal,
    textAlign: 'left',
  },
  nearby: {
    left: responsiveWidth(2),
    fontSize: responsiveFontSize(3),
    color: Color.teal,
    textAlign: 'left',
  },
  buttonpull: {
    backgroundColor: '#15616D',
    position: 'absolute',
    bottom: -0.1,
    width: '100%',
    height: 60,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  janeTypo: {
    fontFamily: FontFamily.dMSansRegular,
    textAlign: 'left',
    color: '#ffecd1',
    fontSize: responsiveFontSize(2.5),
  },
  ellipseParent: {
    // marginTop: -30,
    // width: 280,
    // height: 280,
    alignSelf: 'center',
    // position: 'absolute',
    // backgroundColor: '#78290F',
    // borderRadius: responsiveWidth(50),
  },
  frameInner: {
    marginTop: responsiveHeight(-5),
    // lefT: responsiveWidth(0.2),
    width: responsiveWidth(63),
    height: responsiveHeight(30),
    // borderRadius: responsiveWidth(100),
    // position: 'absolute',
  },
  imagecontainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    // backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
