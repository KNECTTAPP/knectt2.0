import React, { useEffect, useRef } from 'react';
import { Modalize } from 'react-native-modalize';
import { View } from 'react-native';
const BottomPopUp = (props) => {
    const modalizeRef = useRef(null);

    useEffect(() => {
        if (props.isVisible) {
            modalizeRef.current?.open();
        } else {
            modalizeRef.current?.close();
        }
    }, [props.isVisible]);

    return (
        <Modalize
            adjustToContentHeight
            ref={modalizeRef}
            onClose={props.closeModal}
            scrollViewProps={{
                keyboardShouldPersistTaps: 'always',
            }}
            handlePosition="none"
            modalStyle={props.modalStyle}
        >
            <View style={{ marginTop: 20 }}>{props.children}</View>
        </Modalize>
    );
};

export default React.memo(BottomPopUp);