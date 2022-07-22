import { Card, CardMedia, CardContent, Stack, Typography, Link } from '@mui/material';

import styles from '../../../../theme/cssmodule/Components.module.css';
import { ModalStackedCol } from '../../../../shared/components/modals/ModalWrappers';

const NFTConfirmation = ({ formik }: any) => {
    return (
        <>
            <Stack alignItems="center">
                <Card variant="outlined" className={styles['nft-confirmation-card']}>
                    {formik.values.image ? (
                        <CardMedia component="img" src={URL.createObjectURL(formik.values.image)} />
                    ) : (
                        <CardMedia component="img" src="https://robohash.org/0x00?gravatar=hashed" />
                    )}
                    <CardContent>
                        <Stack>
                            <Typography variant="h6" noWrap>
                                {formik.values.name}
                            </Typography>
                            <Typography variant="body2">{formik.values.description}</Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
            <ModalStackedCol
                children={
                    <>
                        <Typography variant="subtitle1">Total To Mint:</Typography>
                        <Typography variant="body2" noWrap>
                            {formik.values.amount}
                        </Typography>
                    </>
                }
            />
            <ModalStackedCol
                children={
                    <>
                        <Typography variant="subtitle1">Owner ID:</Typography>
                        <Typography variant="body2" noWrap>
                            {formik.values.owner && formik.values.owner.length ? formik.values.owner : <i>None set</i>}
                        </Typography>
                    </>
                }
            />
            <ModalStackedCol
                children={
                    <>
                        <Typography variant="body2">Web Validation:</Typography>
                        <Typography variant="body2" noWrap>
                            {formik.values.webvalidate && formik.values.webvalidate.length ? (
                                <Link href={formik.values.webvalidate} target="_blank" aria-label="link-to-external">
                                    {formik.values.webvalidate}
                                </Link>
                            ) : (
                                <i>None set</i>
                            )}
                        </Typography>
                    </>
                }
            />
            <ModalStackedCol
                children={
                    <>
                        <Typography variant="subtitle1">External URL:</Typography>
                        <Typography variant="body2" noWrap>
                            {formik.values.external_url && formik.values.external_url.length ? (
                                <Link href={formik.values.external_url} target="_blank" aria-label="link-to-external">
                                    {formik.values.external_url}
                                </Link>
                            ) : (
                                <i>None set</i>
                            )}
                        </Typography>
                    </>
                }
            />
            <ModalStackedCol
                children={
                    <>
                        <Typography variant="subtitle1">Burn:</Typography>
                        <Typography variant="body2" noWrap>
                            {formik.values.burn && formik.values.burn.length ? formik.values.burn : 0}
                        </Typography>
                    </>
                }
            />
        </>
    );
};

export default NFTConfirmation;
