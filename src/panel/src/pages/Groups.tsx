import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'reactstrap';
import Base from '../components/layout/Base';

interface Group {
  id: string;
  name: string;
  thumb: string;
}

function Groups() {
  const [groups, setGroups] = useState([] as Group[]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/groups')
      .then((response) => setGroups(response.data));
  }, []);

  return (
    <Base>
      <h1 className="mb-4">Usuários</h1>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>Thumb</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr>
              <th>{group.id}</th>
              <th scope="row">
                <div className="text-center" style={{ maxWidth: 80 }}>
                  <Link to={`/group/${group.id}`}>
                    <img
                      src={group.thumb || '/assets/img/user.png'}
                      alt={group.name}
                      className="img-thumbnail"
                    />
                  </Link>
                </div>
              </th>
              <td>{group.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Base>
  );
}

export default Groups;
