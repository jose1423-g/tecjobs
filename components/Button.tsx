import { StyleSheet, View, Pressable, Text } from "react-native";


type Props = {
    label: string;
    onPress?: () => void;
    disabled: boolean;
    theme? : 'primary', 
};

export default function Button({label, disabled, onPress, theme}: Props) {

    if (theme === 'primary') {
        return (        
            <View>
                <Pressable 
                    style={styles.buttonRegister}
                    onPress={onPress}
                    disabled={disabled}
                >
                    <Text style={styles.text}>{ label }</Text>
                </Pressable>
            </View>
        );
    }

    return (        
        <View>
            <Pressable 
                style={styles.buttonLogin}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={styles.text}>{ label }</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonLogin: {        
        backgroundColor: '#5a975b',
        padding: 10,
        fontWeight: 500,        
        width: '100%',
        marginBottom: 20,
        borderRadius: 3,
    },
    buttonRegister: {        
        backgroundColor: '#283b99',
        padding: 10,
        fontWeight: 500,
        width: '100%',
        marginBottom: 20,
        borderRadius: 3,
    },
    text: {
        color: '#ffffff',
        textAlign: 'center',
    }

});