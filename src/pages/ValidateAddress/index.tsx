import { useContext, useEffect, useState } from 'react';
import { appContext } from '../../AppContext';
import * as Yup from 'yup';
import getCurrentNodeVersion from '../../minima/commands/getCurrentVersion';

const ValidateAddress = () => {
    const { setOpenDrawer, loaded } = useContext(appContext);

    const [validationData, setValidationData] = useState<any>(false);

    const [isSubmitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(0);
    const [error, setError] = useState<false | string>(false);
    const [loading, setLoading] = useState(false);

    const [validBuild, setValidBuild] = useState<boolean | null>(null);

    useEffect(() => {
        if (loaded.current === true) {
            getCurrentNodeVersion().then((v) => {
                const versionCheckAddressWasIntroduced = '1.0.21';
                const comparison = v.localeCompare(versionCheckAddressWasIntroduced);
                const isRunningSufficientVersion = comparison === 0 || comparison === 1;

                if (isRunningSufficientVersion) {
                    setValidBuild(true);
                }
                if (!isRunningSufficientVersion) {
                    setValidBuild(false);
                }
            });
        }
    }, [loaded.current]);
return null;

};

export default ValidateAddress;

const validationSchema = () => {
    return Yup.object().shape({
        address: Yup.string()
            .matches(/0|M[xX][0-9a-zA-Z]+/, 'Invalid Address.')
            .min(59, 'Invalid Address, too short.')
            .max(66, 'Invalid Address, too long.')
            .required('Field Required'),
    });
};
