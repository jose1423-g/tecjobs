import { StyleSheet, View, type DimensionValue} from "react-native";
import { Link, LinkProps } from "expo-router";

type Props = {
    label: string;
    theme? : 'login';
    href: LinkProps['href'];
    width: DimensionValue,
};

export default function LinkButton ({label, theme, href, width}: Props) {

    if (theme === 'login') {
        return (        
            <View>
                <Link href={href} style={[styles.buttonLogin, { width: width }]} >
                { label }
                </Link>
            </View>
        );    
    }
    return (        
        <View>
            <Link href={href} style={[styles.buttonRegister, {width: width }]} >
                { label }
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonLogin: {        
        backgroundColor: '#5a975b',
        padding: 10,
        fontWeight: 500,        
        // width: 250,
        marginBottom: 20,
        borderRadius: 3,
        color: '#ffffff',
        textAlign: 'center',
    },
    buttonRegister: {        
        backgroundColor: '#283b99',
        padding: 10,
        fontWeight: 500,
        // width: 250,
        marginBottom: 20,
        borderRadius: 3,
        color: '#ffffff',
        textAlign: 'center',
    },
});