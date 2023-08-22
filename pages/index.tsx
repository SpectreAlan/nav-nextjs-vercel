import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import {Container} from '../static/style/nav/sideMenu'
import Icon from "../components/Icon";
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const nav = await prisma.nav.findMany({
  });
  return {
    props: { feed, nav: [] },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[]
  nav :any
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout nav={props.nav}>
      <Container>
        <Icon content='&#xe606;' className='xxxx' onClick={()=>{console.log(1111)}}/>
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
          <div id="nav1" className="nav1" style={{height: '800px',background: 'red'}}>
            nav1
          </div>
          <div id="nav2" className="nav2" style={{height: '800px',background: 'green'}}>
            nav1
          </div>
          <div id="nav3" className="nav3" style={{height: '800px',background: 'blue'}}>
            nav1
          </div>
        </main>
      </Container>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }
        .nav1{
          height: 400px;
          background: red;
        }
        .nav2{
          height: 400px;
          background: green;
        }
        .nav3{
          height: 400px;
          background: blue;
        }
        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
