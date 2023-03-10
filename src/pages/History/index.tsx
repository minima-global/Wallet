import { useEffect, useState } from 'react';
import { Card, CardHeader, Button, CardContent } from '@mui/material';
import { Stack } from '@mui/system';
import { Outlet, useNavigate } from 'react-router-dom';
import GridLayout from '../../layout/GridLayout';
import { MiSearchBarWithIcon, MiSearchBar } from '../../shared/components/layout/MiToken';
import { Tabs, TabButton, tabStyles } from '../components/MiCustom/MiTabs';

import styles from './History.module.css';
import useTabs from '../../hooks/useTabs';
import { useAppDispatch, useAppSelector } from '../../minima/redux/hooks';
import { callAndStoreHistory, selectHistory } from '../../minima/redux/slices/historySlice';

const History = () => {
    const dispatch = useAppDispatch();
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();
    const { toggleTab, tabs, tabStyles } = useTabs();
    const historyTxpows = useAppSelector(selectHistory);

    useEffect(() => {
        dispatch(callAndStoreHistory());
    }, []);

    return (
        <GridLayout
            children={
                <>
                    <Card variant="outlined">
                        <CardHeader
                            title={
                                <Stack spacing={1}>
                                    <Stack flexDirection="row" alignItems="center" justifyContent="center">
                                        <MiSearchBarWithIcon>
                                            <MiSearchBar
                                                value={filterText}
                                                onChange={(v: any) => {
                                                    setFilterText(v.target.value);
                                                }}
                                                placeholder="Search by name, creator name or tokenid"
                                            />

                                            <Button
                                                variant="contained"
                                                disableElevation
                                                size="small"
                                                color="primary"
                                                onClick={() => navigate('/createnft')}
                                            >
                                                Create
                                            </Button>
                                        </MiSearchBarWithIcon>
                                    </Stack>
                                    <Stack direction="column" justifyContent="space-between" spacing={1}>
                                        <Tabs>
                                            <TabButton
                                                onClick={() => toggleTab(0)}
                                                className={tabs === 0 ? tabStyles['tab-open'] : undefined}
                                            >
                                                All
                                            </TabButton>
                                            <TabButton
                                                onClick={() => toggleTab(1)}
                                                className={tabs === 1 ? tabStyles['tab-open'] : undefined}
                                            >
                                                Starred
                                            </TabButton>
                                        </Tabs>
                                    </Stack>
                                </Stack>
                            }
                        />
                        <CardContent>
                            <Stack spacing={3} sx={{ overflowY: 'auto' }}>
                                {historyTxpows.map((t) => (
                                    <div>{t.txpowid}</div>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </>
            }
        />
    );
};

export default History;
