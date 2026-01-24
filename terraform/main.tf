provider "aws" {
  region = "us-east-1"
}


resource "tls_private_key" "my_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "movie-app-key"
  public_key = tls_private_key.my_key.public_key_openssh
}


resource "local_file" "private_key" {
  content  = tls_private_key.my_key.private_key_pem
  filename = "movie-app-key.pem"
}


resource "aws_security_group" "web_sg" {
  name        = "allow_web_traffic"
  description = "Allow Web and SSH traffic"


  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_instance" "movie_app_server" {
  ami                    = "ami-0c7217cdde317cfec" # Ubuntu 22.04
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "Movie-Ticket-Booking-Server"
  }
}


output "public_ip" {
  value = aws_instance.movie_app_server.public_ip
}
