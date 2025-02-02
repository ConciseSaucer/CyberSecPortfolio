## Install Gentoo using OpenRC
###### Change date and time
~~~shell
sudo su
passwd 
#Use the system settings GUI to set the correct date and time
~~~
###### Preparing the disks
~~~shell
cfdisk /dev/sda
#Select the free disk space and create a partition with a size of 1G
#Create another partition with a size of your choosing, this will be the user directory
#Use the remaining space to create another partition
mkfs.fat -F 32 /dev/sda1
mkfs.ext4 /dev/sda2
mkfs.ext4 /dev/sda3
mkdir --parents /mnt/gentoo
mount /dev/sda3 /mnt/gentoo
cd /mnt/gentoo
mkdir ./home
mount /dev/sda2 ./home
mkdir --parents /mnt/gentoo/efi
mount /dev/sda1 /mnt/gentoo/efi
~~~
###### Installing stage files
~~~shell
#Now you need to install the OpenRC tarball from gentoo.org
mv /home/gentoo/Downloads/stage3-*.tar.xz ./
#Your tarball may have a different file name use tab completition
ls #confirm it moved
tar xpvf stage3-*.tar.xz --xattrs-includ='*.*' --numeric-owner
vim /mnt/gentoo/etc/portage/make.conf
#use nano if you are unfamiliar with vim "ESC :wq" to save and quit
#Flags are up to you. Read the handbook 
#CHANGE
'COMMON_FLAGS="-march=native -02 -pipe"'
#ADD
MAKEOPTS="-j3" #!!!!j represents to amount of jobs do not use all your cpu cores and make sure you have atleast 2GB of ram for each job
#Exit TE
cp --dereference /etc/resolv.conf /mnt/gentoo/etc/
~~~
###### Installing the base system
~~~Shell
arch-chroot /mnt/gentoo
source /etc/profile
emerge-webrsync
emerge --sync #This may take a while

eselect news read all
eslect news purge all #To get rid of the news items
eselect profile list
eselect profile set 23
source /etc/profile

nano /etc/portage/make.conf
#ADD
FEATURES="getbinpkg binpkg-request-signature"
#Exit nano
getuto
#Ignore warnings
emerge -av vim
vim /etc/portage/make.conf
#ADD
USE="-wayland -kde -gnome X pulseaudio -qt dist-kernel"
#ADD
VIDEO_CARDS="qxl"
#ADD
ACCEPT_LICENSE="*"
#exit

emerge --ask --oneshot app-portage/cpuid2cpuflags #type yes
echo "*/* $(cpuid2cpuflags)" > /etc/portage/package.use/00cpu-flags
emerge -av --update --deep --newuse @world
emerge --pretend --depclean
emerge --noreplace app-portage/cpuid2cpuflags
emerge --depclean
ln -sf /usr/share/zoneinfo/America/Indianapolis /etc/localtime
vim /etc/locale.gen
#Remove the comment(#) from en_US.UTF-8 UTF-8
#Exit
locale-gen
eselect locale list
eselect locale set [The number that is the en_US.UTF-8]
source /etc/profile
env-update
~~~
###### Configuring the kernel
~~~Shell
echo ">=sys-kernel/installkernerl-48-r1 dracut" >> /etc/portage/package.use/installkernel
emerge sys-kernel/linux-firmware #AMD
emerge sys-firmware/intel-microcode #INTEL
emerge gentoo-kernel-bin
eselect kernel list
eselect kernel set 1
~~~
###### Configuring the system
~~~Shell
emerge genfstab
genfstab / >> /etc/fstab
echo "[Hostname]" > /etc/hostname
emerge dhcpcd
rc-update add dhcpcd default
cd /etc/init.d
ifconfig
ln -s net.lo net.[your network card should start with enp]
rc-update add net.[your enp] default
vim /etc/host 
#Choose the name of you localhost and add it infront of local host on the ipv4 address
passwd #This will be your actual root password dont forget
~~~
###### Installing the tools
~~~Shell
emerge sysklogd
rc-update add sysklogd default
emerge mlocate
updatedb
emerge app-shells/bash-completion
emerge chrony
rc-update add chronyd default
emerge e2fsprogs dosfstools
emerge sys-block/io-scheduler-udev-rules
~~~
###### Configuring the bootloader
~~~Shell 
echo 'GRUB_PLATFORMS="efi-64"' >> /etc/portage/make.conf
emerge grub
grub-install --efi-directory=/efi
grub-mkconfig -o /boot/grub/grub.cfg
exit
cd ~
umount -R /mnt/gentoo
reboot
~~~