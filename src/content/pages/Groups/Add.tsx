import { Container, LinearProgress, Snackbar, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import PageTitle from "src/components/PageTitle";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import PermissionsList from "src/components/PermissionsList";
import { PermissionMiddleware } from "src/middlewares/PermissionMiddleware"
import { PermissionDetail } from "src/models/Permission";
import { useRequests } from "src/utils/requests";

const AddGroup = () => {
    const [requestsLoading, setRequestsLoading] = useState(true)
    const [infoMessage, setInfomessage] = useState('');
    const [nameInput, setNameInput] = useState("");
    const [permissionsData, setPermissionsData] = useState<PermissionDetail[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    
    const navigate = useNavigate();

    const {getPermissions, addGroup} = useRequests();
    
    const handleGetPermissions = async() => {
        const response = await getPermissions();

        if (!response.detail) {
            setPermissionsData(response.data.permissions);
        }
    }

    const handleAdd = async() => {
        const name = nameInput;
        const permissions = selectedPermissions.join(',')

        if (!name) {
            setInfomessage('Preencha todos os campos')
            return;
        }
        setRequestsLoading(true);
        const response = await addGroup({name, permissions});
        setRequestsLoading(false);

        if (response.detail) {
            setInfomessage(response.detail)
        } else {
            navigate('/groups');

        }
    }


    useEffect(()=> {
        Promise.resolve(handleGetPermissions()).finally(() => {
            setRequestsLoading(false);
        })
    })

    return (
        <PermissionMiddleware codeName="add_group">
            <Helmet>
                <title>Adicionar novo Cargo</title>
            </Helmet>

            {requestsLoading && <LinearProgress sx={{height: 2}} color="primary"/>}

            <PageTitleWrapper>
                <PageTitle
                    heading = "Adicionar um Group"
                    subHeading = "Adicione um grupo e defina nome e permissões."
                />
            </PageTitleWrapper>
            <Snackbar 
                open={infoMessage != ''}
                onClose={() => setInfomessage('')}
                anchorOrigin={{vertical:'bottom', horizontal:"center"}}
                message={infoMessage}
            />
            <Container maxWidth='lg'>
                <Stack maxWidth={700} spacing={3}>
                    <TextField
                        fullWidth
                        label='Nome *'
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />

                    <PermissionsList
                        permissionsData={permissionsData}
                        selectedPermissions={selectedPermissions}
                        setSelectedPermissions={setSelectedPermissions}
                    />
                
                </Stack>


            </Container>

        </PermissionMiddleware>
    )
}

export default AddGroup;    