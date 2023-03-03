import {
  request,
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  requestMultiple,
} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';

interface statusInterface {
  CAMERA: string;
  AUDIO: string;
}

const _checkPermissions = (callback?: any) => {
  const iosPermissions = [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE];
  const androidPermissions = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.RECORD_AUDIO,
  ];
  checkMultiple(
    Platform.OS === 'ios' ? iosPermissions : androidPermissions,
  ).then((statuses: any) => {
    const [CAMERA, AUDIO] =
      Platform.OS === 'ios' ? iosPermissions : androidPermissions;
    if (
      statuses[CAMERA] === RESULTS.UNAVAILABLE ||
      statuses[AUDIO] === RESULTS.UNAVAILABLE
    ) {
      Alert.alert('Error', 'Hardware to support video calls is not available');
    } else if (
      statuses[CAMERA] === RESULTS.BLOCKED ||
      statuses[AUDIO] === RESULTS.BLOCKED
    ) {
      Alert.alert(
        'Error',
        'Permission to access hardware was blocked, please grant manually',
      );
    } else {
      if (
        statuses[CAMERA] === RESULTS.DENIED &&
        statuses[AUDIO] === RESULTS.DENIED
      ) {
        requestMultiple(
          Platform.OS === 'ios' ? iosPermissions : androidPermissions,
        ).then((newStatuses: any) => {
          if (
            newStatuses[CAMERA] === RESULTS.GRANTED &&
            newStatuses[AUDIO] === RESULTS.GRANTED
          ) {
            callback && callback();
          } else {
            Alert.alert('Error', 'One of the permissions was not granted');
          }
        });
      } else if (
        statuses[CAMERA] === RESULTS.DENIED ||
        statuses[AUDIO] === RESULTS.DENIED
      ) {
        request(statuses[CAMERA] === RESULTS.DENIED ? CAMERA : AUDIO).then(
          (result: any) => {
            if (result === RESULTS.GRANTED) {
              callback && callback();
            } else {
              Alert.alert('Error', 'Permission not granted');
            }
          },
        );
      } else if (
        statuses[CAMERA] === RESULTS.GRANTED ||
        statuses[AUDIO] === RESULTS.GRANTED
      ) {
        callback && callback();
      }
    }
  });
};

export default _checkPermissions;
