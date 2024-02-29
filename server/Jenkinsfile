pipeline {
   agent any
   tools {
      nodejs "nodejs-20.x"
   }
   stages{
      stage('checkout') {
         steps {
            checkout scm
         }
      }
      stage('Install dependencies') {
         steps {

            sh 'node -v'
            // sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash'
            // sh '. ~/.nvm/nvm.sh'
            // sh 'nvm install 18'
            sh 'curl -f https://get.pnpm.io/v6.js | node - add --global pnpm '
            sh 'pnpm -v'
            sh 'pnpm install'
         }
      }
      // stage('Build image') {
      //    steps {
      //       sh 'docker build -t chat-app:1.0 .'
      //    }
      // }

      // stage('Docker push') {
      //    steps {
      //       withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
      //          sh 'docker login -u $USERNAME -p $PASSWORD'
      //          sh 'docker tag chat-app:1.0 $USERNAME/chat-app:1.0'
      //          sh 'docker push $USERNAME/chat-app:1.0'
      //          sh 'docker logout'
      //       }
      //    }
      // }
   }
}
