import { IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { CollapseButton } from './styles';

const DMList:FC = () => {
  const {workspace} = useParams<{workspace?:string}>();
  console.log('DMList useQuery');
  const {data:userData} = useQuery('user', ()=> fetcher({queryKey:'/api/users'}), {
    staleTime:2000,
  });
  const {data: memberData} = useQuery<IUserWithOnline[]>(['workspace', workspace, 'member'], ()=> fetcher({queryKey:`/api/workspaces/${workspace}/members`}),{
    enabled: !!userData,
  });
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [onlineList, setOnlineList] = useState<number[]>([]);

  const toggleChannelCollapse = useCallback(()=>{
    setChannelCollapse((prev) => !prev);
  },[]);

  useEffect(()=>{
    console.log('DMList: workspace 바뀜', workspace);
    setOnlineList([]);
  },[workspace]);
  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            return (
              <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
}

export default DMList;